package com.arslanca.dev.business.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationScenarioResponse {
    private String id;
    private String title;
    private String description;
    private SystemState systemState;
    private List<ScenarioOption> options;

    @Data
    @Builder
    public static class SystemState {
        private int cpuLoad;
        private int latency;
        private int memoryUsage;
    }

    @Data
    @Builder
    public static class ScenarioOption {
        private String id;
        private String title;
        private String description;
    }
}