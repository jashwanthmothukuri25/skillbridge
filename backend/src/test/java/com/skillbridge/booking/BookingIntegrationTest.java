package com.skillbridge.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.availability.entity.AvailabilitySlot;
import com.skillbridge.availability.repository.AvailabilitySlotRepository;
import com.skillbridge.booking.dto.BookingRequest;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BookingIntegrationTest {

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

    @Autowired
    private ObjectMapper objectMapper;

    private User student;
    private User mentorUser;
    private MentorshipPackage pkg;
    private AvailabilitySlot slot;
    private String studentToken;

    @BeforeEach
    void setUp() {
        testCleanupService.cleanAll();

        student = new User("student@test.com", passwordEncoder.encode("pass123"), "Test Student", Role.STUDENT);
        student = userRepository.save(student);

        studentToken = tokenProvider.generateTokenForUser(student.getId(), student.getEmail(), "STUDENT", student.getName());

        mentorUser = new User("mentor@test.com", passwordEncoder.encode("pass123"), "Test Mentor", Role.MENTOR);
        mentorUser = userRepository.save(mentorUser);

        MentorProfile mentorProfile = new MentorProfile(mentorUser, "Senior Architect", "Google", 8, BigDecimal.valueOf(1999));
        mentorProfile.setVerificationStatus(VerificationStatus.APPROVED);
        mentorProfile = mentorProfileRepository.save(mentorProfile);

        pkg = new MentorshipPackage(mentorProfile, "System Design Mock", "Full architecture deep dive", 60, BigDecimal.valueOf(1999), 1);
        pkg = packageRepository.save(pkg);

        LocalDateTime startTime = LocalDateTime.now().plusDays(2).withHour(18).withMinute(0);
        slot = new AvailabilitySlot(mentorProfile, startTime, startTime.plusMinutes(60));
        slot = slotRepository.save(slot);
    }

    @Test
    void testCreateBookingSuccessAndRejectDuplicate() throws Exception {
        BookingRequest request = new BookingRequest();
        request.setPackageId(pkg.getId());
        request.setSlotId(slot.getId());
        request.setNotes("Need feedback on microservices partitioning");

        // 1. First booking request should succeed
        mockMvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.status").value("upcoming"))
                .andExpect(jsonPath("$.data.amountInr").value(1999));

        // 2. Second booking request on the same slot must fail with 409 Conflict!
        mockMvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }
}
