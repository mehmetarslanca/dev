package com.arslanca.dev.api.controllers;

import com.arslanca.dev.adapters.GithubAdapter;
import com.arslanca.dev.business.dto.responses.GithubContributionsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class ContributionsTreeController {

    private final GithubAdapter githubAdapter;
    private final CacheManager cacheManager;

    @GetMapping("/contributions")
    public GithubContributionsResponse getContributions() {
        return githubAdapter.getContributions();
    }

    @PostMapping("/contributions/clear-cache")
    public String clearCache() {
        var cache = cacheManager.getCache("github-contributions");
        if (cache != null) {
            cache.clear();
            return "Cache cleared successfully";
        }
        return "Cache not found";
    }

}
