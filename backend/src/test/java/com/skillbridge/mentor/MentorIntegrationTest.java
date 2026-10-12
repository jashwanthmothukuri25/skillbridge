package com.skillbridge.mentor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.availability.entity.AvailabilitySlot;
import com.skillbridge.availability.repository.AvailabilitySlotRepository;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.entity.VerificationStatus;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.packageoffer.entity.MentorshipPackage;
import com.skillbridge.packageoffer.repository.MentorshipPackageRepository;
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
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MentorIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private MentorshipPackageRepository packageRepository;

    @Autowired
    private AvailabilitySlotRepository slotRepository;

    @Autowired
    private com.skillbridge.TestCleanupService testCleanupService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private User mentorUser;
    private MentorProfile mentorProfile;
    private MentorshipPackage pkg;

    @BeforeEach
    void setUp() {
        testCleanupService.cleanAll();

        mentorUser = new User("mentor.pro@test.com", passwordEncoder.encode("secret123"), "Jane Doe", Role.MENTOR);
        mentorUser = userRepository.save(mentorUser);

        mentorProfile = new MentorProfile(mentorUser, "Staff Engineer", "Microsoft", 7, BigDecimal.valueOf(2499));
        mentorProfile.setBio("Experienced backend mentor");
        mentorProfile.setVerificationStatus(VerificationStatus.APPROVED);
        mentorProfile = mentorProfileRepository.save(mentorProfile);

        pkg = new MentorshipPackage(mentorProfile, "1-on-1 Code Review", "Detailed pull request review", 45, BigDecimal.valueOf(1499), 1);
        pkg = packageRepository.save(pkg);

        LocalDateTime now = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0);
        AvailabilitySlot slot = new AvailabilitySlot(mentorProfile, now, now.plusMinutes(45));
        slotRepository.save(slot);
    }

    @Test
    void testGetMentorsPublic() throws Exception {
        mockMvc.perform(get("/api/mentors")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].name").value("Jane Doe"))
                .andExpect(jsonPath("$.data[0].hourlyRateInr").value(2499));
    }

    @Test
    void testGetMentorById() throws Exception {
        mockMvc.perform(get("/api/mentors/" + mentorProfile.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(mentorProfile.getId()))
                .andExpect(jsonPath("$.data.title").value("Staff Engineer"))
                .andExpect(jsonPath("$.data.packages", hasSize(1)))
                .andExpect(jsonPath("$.data.packages[0].title").value("1-on-1 Code Review"))
                .andExpect(jsonPath("$.data.packages[0].priceInr").value(1499))
                .andExpect(jsonPath("$.data.packages[0].priceINR").value(1499));
    }

    @Test
    void testGetMentorPackages() throws Exception {
        mockMvc.perform(get("/api/mentors/" + mentorProfile.getId() + "/packages")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].title").value("1-on-1 Code Review"));
    }

    @Test
    void testGetMentorAvailability() throws Exception {
        mockMvc.perform(get("/api/mentors/" + mentorProfile.getId() + "/availability")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].isBooked").value(false));
    }
}
