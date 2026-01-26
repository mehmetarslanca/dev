package com.arslanca.dev.business.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendMailRequest {

    @Email
    private String senderEmail;

    @NotBlank
    @Size(min = 5, max = 100)
    private String subject;

    @NotBlank
    @Size(min = 5, max = 500)
    private String message;
}
