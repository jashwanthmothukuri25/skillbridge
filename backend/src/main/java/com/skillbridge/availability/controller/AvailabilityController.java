package com.skillbridge.availability.controller;

import com.skillbridge.availability.dto.AvailabilitySlotDto;
import com.skillbridge.availability.dto.CreateSlotRequest;
import com.skillbridge.availability.service.AvailabilityService;
import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/api/mentors/{mentorId}/availability")
    public ResponseEntity<ApiResponse<List<AvailabilitySlotDto>>> getMentorAvailability(
            @PathVariable Long mentorId
    ) {
        List<AvailabilitySlotDto> slots = availabilityService.getAvailableSlots(mentorId);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @PostMapping("/api/mentor/availability")
    public ResponseEntity<ApiResponse<AvailabilitySlotDto>> createSlot(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateSlotRequest request
    ) {
        AvailabilitySlotDto slot = availabilityService.createSlot(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Availability slot created", slot));
    }

    @DeleteMapping("/api/mentor/availability/{slotId}")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long slotId
    ) {
        availabilityService.deleteSlot(userPrincipal.getId(), slotId);
        return ResponseEntity.ok(ApiResponse.success("Slot deleted successfully", null));
    }
}
