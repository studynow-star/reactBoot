package com.colla.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "hospital")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Hospital {

    @Id
    // 암호화요양기호
    private String careCode;

    // 병원 & 약국명
    private String hospitalName;

    // 시/도 코드명
    private String cityCode;

    // 시/군/구 코드명
    private String districtCode;

    // 읍/면/동 코드면
    private String addressDetailCode;

    // 우편번호
    private String postalCode;

    // 주소
    private String address;

    // 전화번호
    private String phoneNumber;

    // 병원 & 약국 홈페이지 URL
    private String hospitalURL;

    // x좌표
    private double x_coordinate;

    // y좌표
    private double y_coordinate;

    // 병원 & 약국 타입
    private String hospitalType;
}
