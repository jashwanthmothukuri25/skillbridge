package com.skillbridge.packageoffer.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.exception.UnauthorizedException;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.packageoffer.dto.CreatePackageRequest;
import com.skillbridge.packageoffer.dto.PackageDto;
import com.skillbridge.packageoffer.entity.MentorshipPackage;
import com.skillbridge.packageoffer.repository.MentorshipPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PackageService {

    private final MentorshipPackageRepository packageRepository;
    private final MentorProfileRepository mentorProfileRepository;

    public PackageService(
            MentorshipPackageRepository packageRepository,
            MentorProfileRepository mentorProfileRepository
    ) {
        this.packageRepository = packageRepository;
        this.mentorProfileRepository = mentorProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<PackageDto> getPackagesByMentorId(Long mentorId) {
        return packageRepository.findByMentorIdAndIsActiveTrue(mentorId)
                .stream()
                .map(PackageDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public PackageDto getPackageById(Long id) {
        MentorshipPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MentorshipPackage", "id", id));
        return PackageDto.fromEntity(pkg);
    }

    @Transactional
    public PackageDto createPackage(Long mentorId, CreatePackageRequest request) {
        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorProfile", "id", mentorId));

        MentorshipPackage pkg = new MentorshipPackage(
                mentor,
                request.getTitle(),
                request.getDescription(),
                request.getDurationMinutes(),
                request.getPriceInr(),
                request.getSessionsCount() != null ? request.getSessionsCount() : 1
        );
        pkg.setTopics(request.getTopics());
        pkg.setDeliverables(request.getDeliverables());
        pkg.setIsActive(true);

        MentorshipPackage saved = packageRepository.save(pkg);
        return PackageDto.fromEntity(saved);
    }

    @Transactional
    public PackageDto updatePackage(Long mentorId, Long packageId, CreatePackageRequest request) {
        MentorshipPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorshipPackage", "id", packageId));

        if (!pkg.getMentor().getId().equals(mentorId)) {
            throw new UnauthorizedException("You are not authorized to update this package.");
        }

        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setDurationMinutes(request.getDurationMinutes());
        pkg.setPriceInr(request.getPriceInr());
        if (request.getSessionsCount() != null) {
            pkg.setSessionsCount(request.getSessionsCount());
        }
        if (request.getTopics() != null) {
            pkg.setTopics(request.getTopics());
        }
        if (request.getDeliverables() != null) {
            pkg.setDeliverables(request.getDeliverables());
        }

        MentorshipPackage updated = packageRepository.save(pkg);
        return PackageDto.fromEntity(updated);
    }

    @Transactional
    public void deactivatePackage(Long mentorId, Long packageId) {
        MentorshipPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorshipPackage", "id", packageId));

        if (!pkg.getMentor().getId().equals(mentorId)) {
            throw new UnauthorizedException("You are not authorized to delete this package.");
        }

        pkg.setIsActive(false);
        packageRepository.save(pkg);
    }
}
