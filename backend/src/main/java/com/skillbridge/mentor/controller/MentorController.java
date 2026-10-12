package com.skillbridge.mentor.controller;

import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.common.response.PagedResponse;
import com.skillbridge.mentor.dto.MentorCardDto;
import com.skillbridge.mentor.dto.MentorStatsDto;
import com.skillbridge.mentor.service.MentorService;
import com.skillbridge.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    @GetMapping("/api/mentors")
    public ResponseEntity<ApiResponse<?>> getMentors(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "rating") String sort,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        if (page != null && size != null) {
            PagedResponse<MentorCardDto> paged = mentorService.searchMentors(company, skill, q, sort, page, size);
            return ResponseEntity.ok(ApiResponse.success(paged));
        } else {
            // Return full list for direct compatibility with DiscoveryPage useMemo
            List<MentorCardDto> list = mentorService.getAllApprovedMentors();
            return ResponseEntity.ok(ApiResponse.success(list));
        }
    }

    @GetMapping("/api/mentors/{id}")
    public ResponseEntity<ApiResponse<MentorCardDto>> getMentorById(@PathVariable Long id) {
        MentorCardDto mentor = mentorService.getMentorById(id);
        return ResponseEntity.ok(ApiResponse.success(mentor));
    }

    @GetMapping("/api/mentor/stats")
    public ResponseEntity<ApiResponse<MentorStatsDto>> getMentorStats(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        MentorStatsDto stats = mentorService.getMentorStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
