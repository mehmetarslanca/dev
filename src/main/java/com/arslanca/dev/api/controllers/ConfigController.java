package com.arslanca.dev.api.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Value("${app.github.address}")
    private String githubAddress;

    @Value("${app.github.nickname}")
    private String githubNickname;

    @GetMapping
    public ResponseEntity<ConfigResponse> getConfig() {
        return ResponseEntity.ok(new ConfigResponse(githubAddress, githubNickname));
    }

    public record ConfigResponse(String githubProfileUrl, String githubUsername) {}
}
