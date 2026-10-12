package com.skillbridge.admin.controller;

import com.skillbridge.admin.dto.AdminStatsDto;
import com.skillbridge.admin.service.AdminService;
import com.skillbridge.booking.dto.BookingResponse;
import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.mentor.dto.MentorCardDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getPlatformStats() {
        AdminStatsDto stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/mentors/pending")
    public ResponseEntity<ApiResponse<List<MentorCardDto>>> getPendingMentors() {
        List<MentorCardDto> list = adminService.getPendingMentors();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/mentors/{id}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyMentor(@PathVariable Long id) {
        adminService.verifyMentor(id);
        return ResponseEntity.ok(ApiResponse.success("Mentor successfully verified and approved.", null));
    }

    @PostMapping("/mentors/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectMentor(@PathVariable Long id) {
        adminService.rejectMentor(id);
        return ResponseEntity.ok(ApiResponse.success("Mentor application declined.", null));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = adminService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
}
