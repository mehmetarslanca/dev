package com.arslanca.dev.business.dto.requests;

import lombok.Data;

@Data
public class SendMailRequest {
    private String senderEmail;
    private String subject;
    private String message;
}
