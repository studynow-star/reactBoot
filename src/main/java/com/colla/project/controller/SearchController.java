package com.colla.project.controller;

import com.colla.project.dto.CityDistrictAreaDTO;
import com.colla.project.dto.HospitalDTO;
import com.colla.project.dto.ResponseDataDTO;
import com.colla.project.dto.WordSearchDTO;
import com.colla.project.service.hospital.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final HospitalService hospitalService;

    // 시/도 & 시/군/구 & 읍/면/동을 통한 검색
    @PostMapping("/cityDistrictDetail")
    public ResponseDataDTO cityDistrictDetailSearch(@RequestBody CityDistrictAreaDTO cityDistrictAreaDTO) {
        System.out.println(cityDistrictAreaDTO);
        return hospitalService.cityDistrictDetailSearch(cityDistrictAreaDTO);
    }

    // 단어를 통한 포함된 검색
    @PostMapping("/wordSearch")
    public ResponseDataDTO wordSearch(@RequestBody WordSearchDTO wordSearchDTO) {
        System.out.println(wordSearchDTO);
        return hospitalService.wordSearch(wordSearchDTO);
    }

    // 병원 & 약국별 상세 정보 검색
    @GetMapping("/detailInfo/{careCode}")
    public HospitalDTO detailInfo(@PathVariable("careCode") String careCode) {
        return hospitalService.detailInfo(careCode);
    }

}
