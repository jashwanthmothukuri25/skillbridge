package com.skillbridge.availability.service;

import com.skillbridge.availability.dto.AvailabilitySlotDto;
import com.skillbridge.availability.dto.CreateSlotRequest;
import com.skillbridge.availability.entity.AvailabilitySlot;
import com.skillbridge.availability.repository.AvailabilitySlotRepository;
import com.skillbridge.common.exception.BadRequestException;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.exception.UnauthorizedException;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilitySlotRepository slotRepository;
    private final MentorProfileRepository mentorProfileRepository;

    public AvailabilityService(
            AvailabilitySlotRepository slotRepository,
            MentorProfileRepository mentorProfileRepository
    ) {
        this.slotRepository = slotRepository;
        this.mentorProfileRepository = mentorProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<AvailabilitySlotDto> getAvailableSlots(Long mentorId) {
        LocalDateTime now = LocalDateTime.now();
        List<AvailabilitySlot> slots = slotRepository
                .findByMentorIdAndIsBookedFalseAndStartTimeAfterOrderByStartTimeAsc(mentorId, now);

        // Fallback: If no future slots remain, fetch all unbooked slots for this mentor
        if (slots.isEmpty()) {
            slots = slotRepository.findByMentorIdOrderByStartTimeAsc(mentorId).stream()
                    .filter(s -> !Boolean.TRUE.equals(s.getIsBooked()))
                    .toList();
        }

        return slots.stream()
                .map(AvailabilitySlotDto::fromEntity)
                .toList();
    }

    @Transactional
    public AvailabilitySlotDto createSlot(Long mentorId, CreateSlotRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Start time must be before end time.");
        }

        MentorProfile mentor = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorProfile", "id", mentorId));

        AvailabilitySlot slot = new AvailabilitySlot(mentor, request.getStartTime(), request.getEndTime());
        AvailabilitySlot saved = slotRepository.save(slot);
        return AvailabilitySlotDto.fromEntity(saved);
    }

    @Transactional
    public void deleteSlot(Long mentorId, Long slotId) {
        AvailabilitySlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("AvailabilitySlot", "id", slotId));

        if (!slot.getMentor().getId().equals(mentorId)) {
            throw new UnauthorizedException("You are not authorized to delete this slot.");
        }

        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            throw new BadRequestException("Cannot delete a slot that has already been booked by a student.");
        }

        slotRepository.delete(slot);
    }
}
