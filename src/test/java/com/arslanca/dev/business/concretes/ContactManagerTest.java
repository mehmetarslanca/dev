package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.dto.requests.SendMailRequest;
import com.arslanca.dev.core.utilities.exceptions.types.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContactManagerTest {

    private ContactManager contactManager;
    private JavaMailSender javaMailSender;
    private final String myEmail = "test@portfolio.com";

    @BeforeEach
    void setUp() {
        javaMailSender = mock(JavaMailSender.class);
        contactManager = new ContactManager(javaMailSender);

        ReflectionTestUtils.setField(contactManager, "myEmail", myEmail);
    }

    @Test
    void send_shouldSendMailSuccessfully_whenRequestIsValid() {

        SendMailRequest request = new SendMailRequest();
        request.setSenderEmail("visitor@example.com");
        request.setSubject("İş Birliği");
        request.setMessage("Merhaba, projenizi çok beğendim.");

        contactManager.send(request);

        ArgumentCaptor<SimpleMailMessage> mailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(javaMailSender, times(1)).send(mailCaptor.capture());

        SimpleMailMessage capturedMail = mailCaptor.getValue();

        assertEquals(myEmail, capturedMail.getTo()[0]);
        assertEquals("visitor@example.com", capturedMail.getReplyTo());
        assertTrue(capturedMail.getSubject().contains("İş Birliği"));
        assertTrue(capturedMail.getText().contains("Merhaba, projenizi çok beğendim."));
    }

    @Test
    void send_shouldThrowBusinessException_whenMailSenderFails() {
        SendMailRequest request = new SendMailRequest();
        doThrow(new MailException("Sistemsel Arıza"){}).when(javaMailSender).send(any(SimpleMailMessage.class));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            contactManager.send(request);
        });

        String expected = "E-posta servisinde geçici bir sorun var, lütfen daha sonra tekrar deneyin.";
        assertEquals(expected, exception.getMessage());

        System.out.println("Başarılı! Yakalanan Mesaj: " + exception.getMessage());
    }

}