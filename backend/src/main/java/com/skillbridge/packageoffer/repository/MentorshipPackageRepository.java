package com.skillbridge.packageoffer.repository;

import com.skillbridge.packageoffer.entity.MentorshipPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorshipPackageRepository extends JpaRepository<MentorshipPackage, Long> {

    List<MentorshipPackage> findByMentorIdAndIsActiveTrue(Long mentorId);

    List<MentorshipPackage> findByMentorId(Long mentorId);

    Optional<MentorshipPackage> findByIdAndMentorId(Long id, Long mentorId);
}
