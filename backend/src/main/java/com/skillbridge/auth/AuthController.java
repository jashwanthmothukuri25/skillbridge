package com.skillbridge.auth;

import com.skillbridge.auth.dto.AuthResponse;
import com.skillbridge.auth.dto.LoginRequest;
import com.skillbridge.auth.dto.RegisterMentorRequest;
import com.skillbridge.auth.dto.RegisterStudentRequest;
import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.security.UserPrincipal;
import com.skillbridge.user.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Sign in successful", response));
    }

    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(@Valid @RequestBody RegisterStudentRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student registration successful", response));
    }

    @PostMapping("/register/mentor")
    public ResponseEntity<ApiResponse<AuthResponse>> registerMentor(@Valid @RequestBody RegisterMentorRequest request) {
        AuthResponse response = authService.registerMentor(request);
        return ResponseEntity.ok(ApiResponse.success("Mentor registration successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDto userDto = authService.getCurrentUser(userPrincipal);
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Successfully logged out", null));
    }
}
