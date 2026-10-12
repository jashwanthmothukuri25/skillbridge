package com.skillbridge.packageoffer.controller;

import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.packageoffer.dto.CreatePackageRequest;
import com.skillbridge.packageoffer.dto.PackageDto;
import com.skillbridge.packageoffer.service.PackageService;
import com.skillbridge.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping("/api/mentors/{mentorId}/packages")
    public ResponseEntity<ApiResponse<List<PackageDto>>> getMentorPackages(@PathVariable Long mentorId) {
        List<PackageDto> packages = packageService.getPackagesByMentorId(mentorId);
        return ResponseEntity.ok(ApiResponse.success(packages));
    }

    @GetMapping("/api/packages/{packageId}")
    public ResponseEntity<ApiResponse<PackageDto>> getPackageById(@PathVariable Long packageId) {
        PackageDto pkg = packageService.getPackageById(packageId);
        return ResponseEntity.ok(ApiResponse.success(pkg));
    }

    @GetMapping("/api/mentor/packages")
    public ResponseEntity<ApiResponse<List<PackageDto>>> getOwnPackages(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<PackageDto> packages = packageService.getPackagesByMentorId(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(packages));
    }

    @PostMapping("/api/mentor/packages")
    public ResponseEntity<ApiResponse<PackageDto>> createPackage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreatePackageRequest request
    ) {
        PackageDto created = packageService.createPackage(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Package created successfully", created));
    }

    @PutMapping("/api/mentor/packages/{packageId}")
    public ResponseEntity<ApiResponse<PackageDto>> updatePackage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long packageId,
            @Valid @RequestBody CreatePackageRequest request
    ) {
        PackageDto updated = packageService.updatePackage(userPrincipal.getId(), packageId, request);
        return ResponseEntity.ok(ApiResponse.success("Package updated successfully", updated));
    }

    @DeleteMapping("/api/mentor/packages/{packageId}")
    public ResponseEntity<ApiResponse<Void>> deactivatePackage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long packageId
    ) {
        packageService.deactivatePackage(userPrincipal.getId(), packageId);
        return ResponseEntity.ok(ApiResponse.success("Package deactivated successfully", null));
    }
}
