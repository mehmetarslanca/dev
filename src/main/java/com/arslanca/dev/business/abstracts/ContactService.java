package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.requests.SendMailRequest;

public interface ContactService {
    void send(SendMailRequest sendMailRequest);
}
