package com.arslanca.dev.business.dto.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
public class GithubRepoResponse {
    private String name;

    private String description;

    @JsonProperty("html_url")
    private String url;

    @JsonProperty("stargazers_count")
    private String stars;

    private String language;
}
