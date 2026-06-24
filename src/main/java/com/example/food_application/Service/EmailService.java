package com.example.food_application.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendWelcomeMail(String to, String name) {
        logger.info("Email sending started for: {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("Welcome to Food Application!");
            
            String htmlMsg = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;'>"
                    + "<h2 style='color: #4CAF50;'>Welcome, " + name + "!</h2>"
                    + "<p>Thank you for registering an account with us.</p>"
                    + "<p>We are excited to have you on board. You can now explore a variety of foods and place orders seamlessly.</p>"
                    + "<br>"
                    + "<p>Best Regards,</p>"
                    + "<p><strong>Food Application Team</strong></p>"
                    + "</div>";
            
            helper.setText(htmlMsg, true);
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Email sending failed for: {} with exact reason: {}", to, e.getMessage(), e);
        }
    }

    public void sendOrderMail(String to, Long orderId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("Order Confirmed - #" + orderId);
            
            String htmlMsg = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;'>"
                    + "<h2 style='color: #4CAF50;'>Order Confirmation</h2>"
                    + "<p>Thank you for your order!</p>"
                    + "<p>Your order <strong>#" + orderId + "</strong> has been placed successfully and is currently being processed.</p>"
                    + "<p>We will notify you once it is out for delivery.</p>"
                    + "<br>"
                    + "<p>Best Regards,</p>"
                    + "<p><strong>Food Application Team</strong></p>"
                    + "</div>";
            
            helper.setText(htmlMsg, true); // true indicates HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log the error or handle it properly in a real app
            logger.error("Order email sending failed for order #{}: {}", orderId, e.getMessage());
        }
    }
}