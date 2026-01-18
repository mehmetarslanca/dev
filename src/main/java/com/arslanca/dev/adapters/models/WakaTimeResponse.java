package com.arslanca.dev.adapters.models;

import lombok.Data;

import java.util.List;

@Data
public class WakaTimeResponse {
    private List<Heartbeat> data; // Liste döner, biz sonuncuyu (en günceli) alacağız

    @Data
    public static class Heartbeat {
        private String project;
        private String branch;
        private String editor;  // ideName
        private String entity;  // currentlyEditingFile (Dosya adı)
        private Double time;    // Unix Timestamp
    }

    @Data
    public static class StatsData {
        private String human_readable_total;
        private String human_readable_daily_average;
    }
}