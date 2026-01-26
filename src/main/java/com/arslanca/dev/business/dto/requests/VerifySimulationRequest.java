package com.arslanca.dev.business.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifySimulationRequest {
    private String scenarioId;
    private String selectedOptionId;
}
