package com.skillbridge.auth;

import com.skillbridge.auth.dto.AuthResponse;
import com.skillbridge.auth.dto.LoginRequest;
import com.skillbridge.auth.dto.RegisterMentorRequest;
import com.skillbridge.auth.dto.RegisterStudentRequest;
import com.skillbridge.common.exception.BadRequestException;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.entity.Skill;
import com.skillbridge.mentor.entity.VerificationStatus;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.mentor.repository.SkillRepository;
import com.skillbridge.security.JwtTokenProvider;
import com.skillbridge.security.UserPrincipal;
import com.skillbridge.user.dto.UserDto;
import com.skillbridge.user.entity.Role;
import com.skillbridge.user.entity.StudentProfile;
import com.skillbridge.user.entity.User;
import com.skillbridge.user.repository.StudentProfileRepository;
import com.skillbridge.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            MentorProfileRepository mentorProfileRepository,
            SkillRepository skillRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.mentorProfileRepository = mentorProfileRepository;
        this.skillRepository = skillRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        UserDto userDto = UserDto.fromEntity(user);
        if (user.getRole() == Role.MENTOR) {
            mentorProfileRepository.findById(user.getId()).ifPresent(mentor -> {
                userDto.setTitle(mentor.getTitle());
                userDto.setCompany(mentor.getCompany());
            });
        }

        return new AuthResponse(jwt, userDto);
    }

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered.");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                Role.STUDENT
        );
        user.setPhone(request.getPhone());
        user.setAvatarUrl(String.format("https://api.dicebear.com/7.x/initials/svg?seed=%s",
                java.net.URLEncoder.encode(request.getName(), java.nio.charset.StandardCharsets.UTF_8)));

        User savedUser = userRepository.save(user);

        StudentProfile profile = new StudentProfile(
                savedUser,
                request.getCollege() != null ? request.getCollege() : "Engineering College",
                request.getDepartment() != null ? request.getDepartment() : "Computer Science",
                request.getYear() != null ? request.getYear() : "Final Year (2026)"
        );
        studentProfileRepository.save(profile);
        savedUser.setStudentProfile(profile);

        String jwt = tokenProvider.generateTokenForUser(savedUser.getId(), savedUser.getEmail(),
                savedUser.getRole().name(), savedUser.getName());

        return new AuthResponse(jwt, UserDto.fromEntity(savedUser));
    }

    @Transactional
    public AuthResponse registerMentor(RegisterMentorRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered.");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                Role.MENTOR
        );
        user.setAvatarUrl(String.format("https://api.dicebear.com/7.x/initials/svg?seed=%s",
                java.net.URLEncoder.encode(request.getName(), java.nio.charset.StandardCharsets.UTF_8)));

        User savedUser = userRepository.save(user);

        MentorProfile mentorProfile = new MentorProfile(
                savedUser,
                request.getTitle() != null ? request.getTitle() : "Software Engineer",
                request.getCompany() != null ? request.getCompany() : "Tech Company",
                request.getExperienceYears() != null ? request.getExperienceYears() : 5,
                request.getHourlyRateInr() != null ? request.getHourlyRateInr() : BigDecimal.valueOf(1999)
        );
        mentorProfile.setVerificationStatus(VerificationStatus.APPROVED);
        mentorProfile.setWorkIdVerified(true);

        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : request.getSkills()) {
                String trimmed = skillName.trim();
                if (!trimmed.isEmpty()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(trimmed)
                            .orElseGet(() -> skillRepository.save(new Skill(trimmed)));
                    skills.add(skill);
                }
            }
            mentorProfile.setSkills(skills);
        }

        mentorProfileRepository.save(mentorProfile);

        String jwt = tokenProvider.generateTokenForUser(savedUser.getId(), savedUser.getEmail(),
                savedUser.getRole().name(), savedUser.getName());

        UserDto userDto = UserDto.fromEntity(savedUser);
        userDto.setTitle(mentorProfile.getTitle());
        userDto.setCompany(mentorProfile.getCompany());

        return new AuthResponse(jwt, userDto);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        UserDto userDto = UserDto.fromEntity(user);
        if (user.getRole() == Role.MENTOR) {
            mentorProfileRepository.findById(user.getId()).ifPresent(mentor -> {
                userDto.setTitle(mentor.getTitle());
                userDto.setCompany(mentor.getCompany());
            });
        }
        return userDto;
    }
}
