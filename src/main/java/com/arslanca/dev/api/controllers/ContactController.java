package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.ContactService;
import com.arslanca.dev.business.requests.SendMailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public void sendMessage(@RequestBody SendMailRequest request) {
        contactService.send(request);
    }
}