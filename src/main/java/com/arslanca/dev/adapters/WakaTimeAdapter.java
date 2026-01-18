package com.arslanca.dev.adapters;

import com.arslanca.dev.adapters.models.WakaTimeResponse;
import com.arslanca.dev.adapters.models.WakaTimeStatsResponse;
import com.arslanca.dev.business.responses.StatsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class WakaTimeAdapter {

    @Value("${WAKA_KEY}")
    private String apiKey;

    private final  String BASE_URL = "https://wakatime.com/api/v1/users/current";
    private final RestTemplate restTemplate = new RestTemplate();

    public StatsResponse getCurrentStatus() {
        String heartbeatsUrl = BASE_URL + "/heartbeats?date=today&api_key=" + apiKey;
        String statsUrl = BASE_URL + "/stats/last_7_days?api_key=" + apiKey;

        try {
            WakaTimeResponse hbResponse = restTemplate.getForObject(heartbeatsUrl, WakaTimeResponse.class);
            WakaTimeStatsResponse statsResponse = restTemplate.getForObject(statsUrl, WakaTimeStatsResponse.class);

            var responseBuilder = StatsResponse.builder();

            if (hbResponse != null && hbResponse.getData() != null && !hbResponse.getData().isEmpty()) {
                var lastHeartbeat = hbResponse.getData().get(hbResponse.getData().size() - 1);

                double currentTimeSeconds = System.currentTimeMillis() / 1000.0;
                boolean isActive = (currentTimeSeconds - lastHeartbeat.getTime()) < 600;

                responseBuilder
                        .isCodingNow(isActive)
                        .ideName(lastHeartbeat.getEditor())
                        .projectName(lastHeartbeat.getProject())
                        .currentlyEditingFile(formatFileName(lastHeartbeat.getEntity())) // Sadece dosya adını alalım
                        .lastActiveTime(convertTime(lastHeartbeat.getTime()));
            } else {
                responseBuilder.isCodingNow(false);
            }

            if (statsResponse != null && statsResponse.getData() != null) {
                responseBuilder.totalSpentOnAllProjects(statsResponse.getData().getHuman_readable_total());
                if (responseBuilder.build().getProjectName() != null) {
                    responseBuilder.totalSpentOnCurrentProject(statsResponse.getData().getHuman_readable_daily_average());
                }
            }

            return responseBuilder.build();

        } catch (Exception e) {
            System.err.println("WakaTime API Hatası: " + e.getMessage());
            return StatsResponse.builder().isCodingNow(false).build();
        }
    }

    private String formatFileName(String fullPath) {
        if (fullPath == null) return "Unknown";
        int lastSlash = fullPath.lastIndexOf("/");
        if (lastSlash == -1) lastSlash = fullPath.lastIndexOf("\\"); // Windows için
        return lastSlash != -1 ? fullPath.substring(lastSlash + 1) : fullPath;
    }

    private String convertTime(Double timestamp) {
        Date date = new Date((long) (timestamp * 1000));
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        return sdf.format(date);
    }
}
