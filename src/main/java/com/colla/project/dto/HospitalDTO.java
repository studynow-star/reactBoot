package com.colla.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HospitalDTO {

    private String careCode;

    private String hospitalName;

    private String cityCode;

    private String districtCode;

    private String addressDetailCode;

    private String postalCode;

    private String address;

    private String phoneNumber;

    private String hospitalURL;

    private double x_coordinate;

    private double y_coordinate;

    private String hospitalType;
}