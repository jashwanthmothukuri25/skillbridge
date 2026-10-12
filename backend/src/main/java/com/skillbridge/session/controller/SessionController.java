package com.skillbridge.session.controller;

import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.security.UserPrincipal;
import com.skillbridge.session.dto.SessionRoomDto;
import com.skillbridge.session.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/api/sessions/{bookingId}")
    public ResponseEntity<ApiResponse<SessionRoomDto>> getSessionRoom(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String bookingId
    ) {
        SessionRoomDto room = sessionService.getSessionRoom(bookingId, userPrincipal.getId(), userPrincipal.getRole());
        return ResponseEntity.ok(ApiResponse.success(room));
    }
}
