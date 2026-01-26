package com.arslanca.dev.business.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateBlogRequest {
    @NotBlank
    @Size (min = 5, max=250)
    private String title;
    @NotBlank
    @Size (max = 2000)
    private String content;
}
