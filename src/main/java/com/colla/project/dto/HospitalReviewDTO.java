package com.colla.project.dto;

import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class HospitalReviewDTO {

    private String careCode;

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 10;

    public Pageable getPageable(){
        return PageRequest.of(this.page -1, this.size);
    }
}