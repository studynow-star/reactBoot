package com.colla.project.service;

import com.colla.project.dto.HospitalReviewDTO;
import com.colla.project.dto.PageResponseDTO;
import com.colla.project.dto.ReviewDTO;
import com.colla.project.entity.Customer;
import com.colla.project.entity.Hospital;
import com.colla.project.entity.QReview;
import com.colla.project.entity.Review;
import com.colla.project.repository.CustomerRepository;
import com.colla.project.repository.HospitalRepository;
import com.colla.project.repository.ReviewRepository;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService extends QuerydslRepositorySupport {

    public ReviewService(){
        super(Hospital.class);
    }

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    private ReviewDTO entityToDTO(Review review){
        return ReviewDTO.builder()
                .text(review.getText())
                .careCode(review.getHospital().getCareCode())
                .username(review.getCustomer().getUsername())
                .id(review.getId())
                .build();
    }

    @Transactional
    public Review saveReview(ReviewDTO reviewDTO) {
        System.out.println("Received careCode: " + reviewDTO.getCareCode()); // 디버깅을 위한 로그

        // 고객 조회
        Customer customer = customerRepository.findById(reviewDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // 병원 조회
        Hospital hospital = hospitalRepository.findById(reviewDTO.getCareCode())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        // 리뷰 생성 및 저장
        Review review = Review.builder()
                .text(reviewDTO.getText())
                .hospital(hospital) // 병원 설정
                .customer(customer)
                .build();

        return reviewRepository.save(review);
    }

    public PageResponseDTO getReviews(HospitalReviewDTO dto){
        QReview review = QReview.review;
        JPQLQuery<Review> query = from(review);

        query.where(review.hospital.careCode.eq(dto.getCareCode()));

        query.orderBy(review.id.desc());

        long count = query.fetchCount();

        this.getQuerydsl().applyPagination(dto.getPageable(), query);

        List<Review> list = query.fetch();

        return new PageResponseDTO(dto.getPage(), dto.getSize(), list.stream().map(this::entityToDTO).collect(Collectors.toList()), (int)count);
    }

    // 모든 리뷰 조회
//    @Transactional(readOnly = true)
//    public List<ReviewDTO> getAllReviews() {
//        return reviewRepository.findAll().stream()
//                .map(review -> {
//                    ReviewDTO dto = new ReviewDTO();
//                    dto.setText(review.getText());
//                    dto.setUsername(review.getCustomer().getUsername()); // Customer에서 username 가져오기
//                    dto.setCareCode(review.getHospital().getCareCode()); // 병원의 careCode 가져오기
//                    return dto;
//                })
//                .collect(Collectors.toList());
//    }

}
