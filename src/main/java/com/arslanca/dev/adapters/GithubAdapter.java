package com.arslanca.dev.adapters;

import com.arslanca.dev.business.dto.responses.ContributionDay;
import com.arslanca.dev.business.dto.responses.GithubContributionsResponse;
import com.arslanca.dev.business.dto.responses.GithubRepoResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GithubAdapter {

    private final RestClient.Builder restClientBuilder;

    @Value("${app.github.nickname}")
    private String githubUsername;

    @Value("${app.github.token:}")
    private String githubToken;

    @Cacheable(value = "github-repos")
    @Scheduled(fixedRate = 600000)
    public List<GithubRepoResponse> getRepos(){
        RestClient.Builder builder = restClientBuilder.baseUrl("https://api.github.com");

        if (githubToken != null && !githubToken.isEmpty()) {
            builder.defaultHeader("Authorization", "Bearer " + githubToken);
        }

        RestClient restClient = builder.build();
        return restClient.get()
                .uri("/users/" + githubUsername + "/repos?sort=updated&direction=desc") //günceli üste al
                .retrieve()
                .body(new ParameterizedTypeReference<List<GithubRepoResponse>>() {});
    }

    @Cacheable(value = "github-contributions")
    public String getContributionsData() {
        String query = """
        {
          "query": "{ user(login: \\"%s\\") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date contributionLevel } } } } } }"
        }
        """.formatted(githubUsername);

        RestClient restClient = restClientBuilder
                .baseUrl("https://api.github.com/graphql")
                .defaultHeader("Authorization", "Bearer " + githubToken)
                .defaultHeader("Content-Type", "application/json")
                .build();

        return restClient.post()
                .body(query)
                .retrieve()
                .body(String.class);
    }

    public GithubContributionsResponse getContributions() {
        String rawJson = getContributionsData();
        System.out.println("Raw GitHub Response: " + rawJson);

        ObjectMapper mapper = new ObjectMapper();
        List<ContributionDay> allDays = new ArrayList<>();

        try {
            JsonNode root = mapper.readTree(rawJson);
            JsonNode calendar = root.path("data").path("user").path("contributionsCollection").path("contributionCalendar");

            if (calendar.isMissingNode()) {
                System.err.println("Calendar node is missing! Full response: " + rawJson);
                return new GithubContributionsResponse(0, allDays);
            }

            int total = calendar.path("totalContributions").asInt();
            System.out.println("Total contributions: " + total);

            calendar.path("weeks").forEach(week -> {
                week.path("contributionDays").forEach(day -> {
                    String levelStr = day.path("contributionLevel").asText();
                    int level = convertLevelToInt(levelStr);

                    allDays.add(new ContributionDay(
                            day.path("date").asText(),
                            day.path("contributionCount").asInt(),
                            level
                    ));
                });
            });

            System.out.println("Total days processed: " + allDays.size());
            return new GithubContributionsResponse(total, allDays);
        } catch (Exception e) {
            System.err.println("Error processing GitHub data: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("GitHub verisi işlenemedi", e);
        }
    }

    private int convertLevelToInt(String level) {
        return switch (level) {
            case "NONE" -> 0;
            case "FIRST_QUARTILE" -> 1;
            case "SECOND_QUARTILE" -> 2;
            case "THIRD_QUARTILE" -> 3;
            case "FOURTH_QUARTILE" -> 4;
            default -> 0;
        };
    }


}
