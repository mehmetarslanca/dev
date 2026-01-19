package com.arslanca.dev.adapters;

import com.arslanca.dev.adapters.models.WakaTimeResponse;
import com.arslanca.dev.adapters.models.WakaTimeSummariesResponse;
import com.arslanca.dev.business.responses.StatsResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class WakaTimeAdapter {

    @Value("${WAKA_KEY}")
    private String apiKey;

    private static final String BASE_URL = "https://wakatime.com/api/v1/users/current";
    private final RestTemplate restTemplate = new RestTemplate();
    private StatsResponse lastResponse = StatsResponse.builder().isCodingNow(false).build();
    private final AtomicLong lastFetchTime = new AtomicLong(0);
    private static final long RATE_LIMIT_MS = 60000;

    @PostConstruct
    public void init() {
        refreshWakaTimeStats();
    }

    public StatsResponse getCurrentStatus() {
        long now = System.currentTimeMillis();
        if (now - lastFetchTime.get() > RATE_LIMIT_MS) {
            synchronized (this) {
                if (now - lastFetchTime.get() > RATE_LIMIT_MS) {
                    refreshWakaTimeStats();
                }
            }
        }
        return lastResponse;
    }

    private void refreshWakaTimeStats() {
        String summariesUrl = BASE_URL + "/summaries?start=today&end=today&api_key=" + apiKey;
        String heartbeatsUrl = BASE_URL + "/heartbeats?date=today&api_key=" + apiKey;

        try {
            WakaTimeResponse hbResponse = restTemplate.getForObject(heartbeatsUrl, WakaTimeResponse.class);
            WakaTimeSummariesResponse summariesResponse = restTemplate.getForObject(summariesUrl, WakaTimeSummariesResponse.class);

            var responseBuilder = StatsResponse.builder();
            String currentProjectName = null;

            if (hbResponse != null && hbResponse.getData() != null && !hbResponse.getData().isEmpty()) {
                var lastHeartbeat = hbResponse.getData().get(hbResponse.getData().size() - 1);

                double currentTimeSeconds = System.currentTimeMillis() / 1000.0;
                boolean isActive = (currentTimeSeconds - lastHeartbeat.getTime()) < 600;

                currentProjectName = lastHeartbeat.getProject();

                responseBuilder
                        .isCodingNow(isActive)
                        .ideName(lastHeartbeat.getEditor())
                        .projectName(currentProjectName)
                        .currentlyEditingFile(formatFileName(lastHeartbeat.getEntity()))
                        .lastActiveTime(convertTime(lastHeartbeat.getTime()));
            } else {
                responseBuilder.isCodingNow(false);
            }

            if (summariesResponse != null && summariesResponse.getData() != null && !summariesResponse.getData().isEmpty()) {
                var todaySummary = summariesResponse.getData().get(0);

                if (todaySummary.getGrand_total() != null) {
                    responseBuilder.totalSpentOnAllProjects(todaySummary.getGrand_total().getText());
                } else {
                     responseBuilder.totalSpentOnAllProjects("0 mins");
                }

                if (currentProjectName != null && todaySummary.getProjects() != null) {
                    String finalCurrentProjectName = currentProjectName;

                    var projectStat = todaySummary.getProjects().stream()
                            .filter(p -> p.getName().equalsIgnoreCase(finalCurrentProjectName))
                            .findFirst();

                    if (projectStat.isPresent()) {
                        responseBuilder.totalSpentOnCurrentProject(projectStat.get().getText());
                    } else {
                        responseBuilder.totalSpentOnCurrentProject("Just started");
                    }
                }
            } else {
                 responseBuilder.totalSpentOnAllProjects("0 mins");
            }

            lastResponse = responseBuilder.build();
            lastFetchTime.set(System.currentTimeMillis());

        } catch (Exception e) {
            System.err.println("WakaTime API Hata veya Rate Limit: " + e.getMessage());
        }
    }

    private String formatFileName(String fullPath) {
        if (fullPath == null) return "Unknown";
        int lastSlash = fullPath.lastIndexOf("/");
        if (lastSlash == -1) lastSlash = fullPath.lastIndexOf("\\");
        return lastSlash != -1 ? fullPath.substring(lastSlash + 1) : fullPath;
    }

    private String convertTime(Double timestamp) {
        Date date = new Date((long) (timestamp * 1000));
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        return sdf.format(date);
    }
}