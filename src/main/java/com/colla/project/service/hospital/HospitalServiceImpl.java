package com.colla.project.service.hospital;

import com.colla.project.dto.CityDistrictAreaDTO;
import com.colla.project.dto.HospitalDTO;
import com.colla.project.dto.ResponseDataDTO;
import com.colla.project.dto.WordSearchDTO;
import com.colla.project.entity.Hospital;
import com.colla.project.entity.QHospital;
import com.colla.project.repository.HospitalRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class HospitalServiceImpl extends QuerydslRepositorySupport implements HospitalService {

    public HospitalServiceImpl(){
        super(Hospital.class);
    }


    @Autowired
    private HospitalRepository hospitalRepository;

    @Override
    public ResponseDataDTO cityDistrictDetailSearch(CityDistrictAreaDTO cityDistrictAreaDTO) {
        QHospital hospital = QHospital.hospital;
        JPQLQuery<Hospital> query = from(hospital);

        // eq => 무조건 동일한거
        query.where(hospital.cityCode.eq(cityDistrictAreaDTO.getCityCode()));

        // 시/군/구가 아닐경우
        if(!cityDistrictAreaDTO.getDistrictCode().equals("시/군/구")){
            BooleanBuilder booleanBuilder = new BooleanBuilder();

            booleanBuilder.and(hospital.districtCode.eq(cityDistrictAreaDTO.getDistrictCode()));

            // 읍/면/동이 아닐경우
            if(!cityDistrictAreaDTO.getAddressDetailCode().equals("읍/면/동")){
                booleanBuilder.and(hospital.addressDetailCode.eq(cityDistrictAreaDTO.getAddressDetailCode()));
            }

            query.where(booleanBuilder);
        }

        long count = query.fetchCount();

        this.getQuerydsl().applyPagination(cityDistrictAreaDTO.getPageable(), query);

        ResponseDataDTO responseData = new ResponseDataDTO();

        for(Hospital data : query.fetch()){
            HospitalDTO dto = entityToDTO(data);

            responseData.getDataList().add(dto);
            responseData.setTotalCount(count);
        }

        return responseData;
    }

    @Override
    public ResponseDataDTO wordSearch(WordSearchDTO wordSearchDTO) {
        QHospital hospital = QHospital.hospital;
        JPQLQuery<Hospital> query = from(hospital);

        query.where(hospital.hospitalName.contains(wordSearchDTO.getWord()));

        long count = 0;

        if(wordSearchDTO.getPage() == 1) {
            count = query.fetchCount();
        }

        this.getQuerydsl().applyPagination(wordSearchDTO.getPageable(), query);

        ResponseDataDTO responseData = new ResponseDataDTO();

        for(Hospital data : query.fetch()) {
            HospitalDTO dto = entityToDTO(data);

            responseData.getDataList().add(dto);
            responseData.setTotalCount(count);
        }

        return responseData;
    }

    @Override
    public HospitalDTO detailInfo(String careCode) {
        return entityToDTO(hospitalRepository.findById(careCode).orElseThrow());
    }
}
