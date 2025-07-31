package com.colla.project.dto;

import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CityDistrictAreaDTO {

    private String cityCode;

    private String districtCode;

    private String addressDetailCode;

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 20;

    public Pageable getPageable(){
            return PageRequest.of(this.page -1, this.size);
    }
}