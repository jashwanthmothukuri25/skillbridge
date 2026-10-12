package com.skillbridge.admin;

import com.skillbridge.TestCleanupService;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.entity.VerificationStatus;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.security.JwtTokenProvider;
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

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private TestCleanupService testCleanupService;

    private User adminUser;
    private String adminToken;
    private User pendingMentorUser;
    private MentorProfile pendingMentorProfile;

    @BeforeEach
    void setUp() {
        testCleanupService.cleanAll();

        adminUser = new User("admin@skillbridge.in", passwordEncoder.encode("adminPass123!"), "Platform Admin", Role.ADMIN);
        adminUser = userRepository.save(adminUser);
        adminToken = tokenProvider.generateTokenForUser(adminUser.getId(), adminUser.getEmail(), "ADMIN", adminUser.getName());

        pendingMentorUser = new User("pending@skillbridge.in", passwordEncoder.encode("pass123"), "Pending Mentor", Role.MENTOR);
        pendingMentorUser = userRepository.save(pendingMentorUser);

        pendingMentorProfile = new MentorProfile(pendingMentorUser, "Junior Dev", "Acme Corp", 2, BigDecimal.valueOf(999));
        pendingMentorProfile.setVerificationStatus(VerificationStatus.PENDING);
        pendingMentorProfile = mentorProfileRepository.save(pendingMentorProfile);
    }

    @Test
    void testGetAdminStats() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.pendingApprovals").value(1))
                .andExpect(jsonPath("$.data.activeMentors").value(0))
                .andExpect(jsonPath("$.data.totalBookings").value(0));
    }

    @Test
    void testVerifyMentor() throws Exception {
        mockMvc.perform(post("/api/admin/mentors/" + pendingMentorProfile.getId() + "/verify")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testNonAdminForbidden() throws Exception {
        User student = new User("student2@skillbridge.in", passwordEncoder.encode("pass123"), "Normal Student", Role.STUDENT);
        student = userRepository.save(student);
        String studentToken = tokenProvider.generateTokenForUser(student.getId(), student.getEmail(), "STUDENT", student.getName());

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
