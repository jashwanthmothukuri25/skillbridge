package com.skillbridge.mentor.repository;

import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.entity.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {

    List<MentorProfile> findByVerificationStatus(VerificationStatus status);

    Page<MentorProfile> findByVerificationStatus(VerificationStatus status, Pageable pageable);

    long countByVerificationStatus(VerificationStatus status);

    @Query("""
        SELECT DISTINCT m FROM MentorProfile m
        LEFT JOIN m.user u
        LEFT JOIN m.skills s
        WHERE m.verificationStatus = :status
          AND (:company IS NULL OR LOWER(m.company) = LOWER(:company))
          AND (:skillName IS NULL OR LOWER(s.name) = LOWER(:skillName))
          AND (:search IS NULL OR (
                LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(m.company) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%'))
          ))
    """)
    Page<MentorProfile> searchMentors(
            @Param("status") VerificationStatus status,
            @Param("company") String company,
            @Param("skillName") String skillName,
            @Param("search") String search,
            Pageable pageable
    );
}
