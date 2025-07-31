package com.colla.project.service.hospital;

import com.colla.project.dto.CityDistrictAreaDTO;
import com.colla.project.dto.HospitalDTO;
import com.colla.project.dto.ResponseDataDTO;
import com.colla.project.dto.WordSearchDTO;
import com.colla.project.entity.Hospital;

import java.util.List;

public interface HospitalService {

    ResponseDataDTO cityDistrictDetailSearch(CityDistrictAreaDTO cityDistrictAreaDTO);

    ResponseDataDTO wordSearch(WordSearchDTO wordSearchDTO);

    HospitalDTO detailInfo(String careCode);

    default HospitalDTO entityToDTO(Hospital hospital){
        return HospitalDTO.builder()
                .careCode(hospital.getCareCode())
                .hospitalName(hospital.getHospitalName())
                .hospitalURL(hospital.getHospitalURL())
                .addressDetailCode(hospital.getAddressDetailCode())
                .cityCode(hospital.getCityCode())
                .postalCode(hospital.getPostalCode())
                .phoneNumber(hospital.getPhoneNumber())
                .x_coordinate(hospital.getX_coordinate())
                .y_coordinate(hospital.getY_coordinate())
                .address(hospital.getAddress())
                .districtCode(hospital.getDistrictCode())
                .hospitalType(hospital.getHospitalType())
                .build();
    }
}
