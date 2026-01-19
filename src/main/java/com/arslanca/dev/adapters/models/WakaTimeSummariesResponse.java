package com.arslanca.dev.adapters.models;

import lombok.Data;
import java.util.List;

@Data
public class WakaTimeSummariesResponse {
    private List<SummaryData> data;

    @Data
    public static class SummaryData {
        private GrandTotal grand_total;
        private List<ProjectStat> projects;
    }

    @Data
    public static class GrandTotal {
        private String text;
        private Double total_seconds;
    }

    @Data
    public static class ProjectStat {
        private String name;
        private String text;
        private Double total_seconds;
        private Double percent;
    }
}
