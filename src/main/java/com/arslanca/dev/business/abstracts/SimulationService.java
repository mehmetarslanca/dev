package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.dto.requests.VerifySimulationRequest;
import com.arslanca.dev.business.dto.responses.SimulationScenarioResponse;
import com.arslanca.dev.business.dto.responses.VerificationResultResponse;

public interface SimulationService {
    SimulationScenarioResponse getRandomScenario();
    VerificationResultResponse verifyResult(VerifySimulationRequest request);
}
