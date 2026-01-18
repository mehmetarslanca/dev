package com.arslanca.dev.adapters.models;

import lombok.Data;

@Data
public class WakaTimeStatsResponse {
    private StatsData data;

    @Data
    public static class StatsData {
        private String human_readable_total;
        private String human_readable_daily_average;
    }
}
