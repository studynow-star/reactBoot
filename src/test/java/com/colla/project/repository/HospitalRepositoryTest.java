package com.colla.project.repository;

import com.colla.project.entity.Hospital;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@RequiredArgsConstructor
@Log4j2
class HospitalRepositoryTest {

    @Autowired
    private HospitalRepository hospitalRepository;

    // 병원정보 한 개 정보 테스트
    @Test
    public void hospitalOneSelect(){
        Hospital hospital = hospitalRepository.findById("JDQ4MTYyMiM1MSMkMiMkMCMkMDAkNTgxMzUxIzExIyQxIyQ3IyQ3OSQyNjE4MzIjNDEjJDEjJDgjJDgz").orElseThrow();

        log.info(hospital);
    }
}