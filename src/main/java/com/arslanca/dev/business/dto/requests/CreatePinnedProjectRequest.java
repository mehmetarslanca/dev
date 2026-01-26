package com.arslanca.dev.business.dto.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePinnedProjectRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private List<String> tags;

    private String githubUrl;
}
