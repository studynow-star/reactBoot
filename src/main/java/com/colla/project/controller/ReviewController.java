package com.colla.project.controller;

import com.colla.project.dto.HospitalReviewDTO;
import com.colla.project.dto.PageResponseDTO;
import com.colla.project.dto.ReviewDTO;
import com.colla.project.entity.Review;
import com.colla.project.repository.ReviewRepository;
import com.colla.project.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;

    // 리뷰 작성
    @PostMapping()
    public ResponseEntity<Review> createReview(@RequestBody ReviewDTO reviewDTO) {
        System.out.println("ReviewDTO: " + reviewDTO); // 디버깅을 위한 로그
        Review review = reviewService.saveReview(reviewDTO);
        return ResponseEntity.ok(review);
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Long id) {
        System.out.println("삭제하는 리뷰의 번호 : " + id);
        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 병원 & 약국 별 리뷰 가져오기
    @GetMapping("/{careCode}/{page}")
    public PageResponseDTO getReviews(@PathVariable("careCode") String careCode, @PathVariable("page") int page){
        HospitalReviewDTO reviewDTO = HospitalReviewDTO.builder()
                .careCode(careCode)
                .page(page)
                .build();
        System.out.println(reviewDTO);
        return reviewService.getReviews(reviewDTO);
    }

    // 모든 리뷰 조회
//    @GetMapping()
//    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
//        List<ReviewDTO> reviews = reviewService.getAllReviews();
//        return ResponseEntity.ok(reviews);
//    }
}
