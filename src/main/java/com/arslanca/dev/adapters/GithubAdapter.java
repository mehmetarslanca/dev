package com.arslanca.dev.adapters;

import com.arslanca.dev.business.dto.responses.GithubRepoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

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


}
