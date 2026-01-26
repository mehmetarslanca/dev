package com.arslanca.dev.business.dto.requests;

import lombok.Data;

@Data
public class CreateBlogRequest {
    private String title;
    private String content;
}
