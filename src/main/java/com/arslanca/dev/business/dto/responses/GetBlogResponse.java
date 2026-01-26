package com.arslanca.dev.business.dto.responses;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetBlogResponse {

    private int id;

    private String title;

    private String content;

    private LocalDate createdDate;
}
