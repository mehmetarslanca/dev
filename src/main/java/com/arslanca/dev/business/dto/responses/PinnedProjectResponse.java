package com.arslanca.dev.business.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PinnedProjectResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> tags;
    private String githubUrl;
}
