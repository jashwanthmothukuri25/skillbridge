package com.skillbridge;

import com.skillbridge.availability.repository.AvailabilitySlotRepository;
import com.skillbridge.booking.repository.BookingRepository;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.packageoffer.repository.MentorshipPackageRepository;
import com.skillbridge.payment.repository.PaymentRepository;
import com.skillbridge.review.repository.ReviewRepository;
import com.skillbridge.session.repository.SessionRoomRepository;
import com.skillbridge.user.repository.StudentProfileRepository;
import com.skillbridge.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TestCleanupService {

    @Autowired
    private SessionRoomRepository sessionRoomRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AvailabilitySlotRepository slotRepository;

    @Autowired
    private MentorshipPackageRepository packageRepository;

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void cleanAll() {
        sessionRoomRepository.deleteAll();
        reviewRepository.deleteAll();
        paymentRepository.deleteAll();
        bookingRepository.deleteAll();
        slotRepository.deleteAll();
        packageRepository.deleteAll();
        mentorProfileRepository.deleteAll();
        studentProfileRepository.deleteAll();
        userRepository.deleteAll();
    }
}
