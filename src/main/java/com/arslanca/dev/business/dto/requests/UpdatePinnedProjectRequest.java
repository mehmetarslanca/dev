package com.arslanca.dev.business.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePinnedProjectRequest {
    private String title;
    private String description;
    private List<String> tags;
    private String githubUrl;
}
