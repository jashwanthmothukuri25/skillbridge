package com.skillbridge.booking.controller;

import com.skillbridge.booking.dto.BookingRequest;
import com.skillbridge.booking.dto.BookingResponse;
import com.skillbridge.booking.service.BookingService;
import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/api/bookings")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody BookingRequest request
    ) {
        BookingResponse booking = bookingService.createBooking(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Session booked successfully", booking));
    }

    @GetMapping("/api/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        if (userPrincipal.getRole() == com.skillbridge.user.entity.Role.MENTOR) {
            List<BookingResponse> bookings = bookingService.getMentorBookings(userPrincipal.getId());
            return ResponseEntity.ok(ApiResponse.success(bookings));
        } else {
            List<BookingResponse> bookings = bookingService.getStudentBookings(userPrincipal.getId());
            return ResponseEntity.ok(ApiResponse.success(bookings));
        }
    }

    @GetMapping("/api/bookings/my-student-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getStudentBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<BookingResponse> bookings = bookingService.getStudentBookings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/api/mentor/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMentorBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<BookingResponse> bookings = bookingService.getMentorBookings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/api/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingDetails(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id
    ) {
        BookingResponse booking = bookingService.getBookingDetails(id, userPrincipal.getId(), userPrincipal.getRole());
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PostMapping("/api/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id
    ) {
        BookingResponse booking = bookingService.cancelBooking(id, userPrincipal.getId(), userPrincipal.getRole());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
}
