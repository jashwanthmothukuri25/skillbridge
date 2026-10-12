package com.skillbridge;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderTest {

    @Test
    void generateHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashDemoPass = encoder.encode("demoPass123!");
        String hashDemo1234 = encoder.encode("demo1234");
        System.out.println("HASH_DEMO_PASS: " + hashDemoPass);
        System.out.println("HASH_DEMO_1234: " + hashDemo1234);
        assertTrue(encoder.matches("demoPass123!", hashDemoPass));
        assertTrue(encoder.matches("demo1234", hashDemo1234));
    }
}
