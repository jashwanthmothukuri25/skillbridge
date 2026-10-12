package com.skillbridge.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.auth.dto.LoginRequest;
import com.skillbridge.auth.dto.RegisterStudentRequest;
import com.skillbridge.user.entity.Role;
import com.skillbridge.user.entity.User;
import com.skillbridge.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.skillbridge.TestCleanupService testCleanupService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        testCleanupService.cleanAll();
        User testUser = new User("test.student@college.edu", passwordEncoder.encode("password123"), "Test Student", Role.STUDENT);
        userRepository.save(testUser);
    }

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test.student@college.edu");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.user.email").value("test.student@college.edu"))
                .andExpect(jsonPath("$.data.user.role").value("student"));
    }

    @Test
    void testLoginBadCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test.student@college.edu");
        request.setPassword("wrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testRegisterStudentSuccess() throws Exception {
        RegisterStudentRequest request = new RegisterStudentRequest();
        request.setName("New Student");
        request.setEmail("new.student@college.edu");
        request.setPassword("secretPass123");
        request.setCollege("IIT Bombay");
        request.setDepartment("CSE");
        request.setYear("2026");

        mockMvc.perform(post("/api/auth/register/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.user.name").value("New Student"))
                .andExpect(jsonPath("$.data.user.college").value("IIT Bombay"));
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        RegisterStudentRequest request = new RegisterStudentRequest();
        request.setName("Duplicate Student");
        request.setEmail("test.student@college.edu"); // already exists
        request.setPassword("secretPass123");

        mockMvc.perform(post("/api/auth/register/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("already registered")));
    }
}
