package com.colla.project.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ResponseDataDTO {

    private  List<HospitalDTO> dataList= new ArrayList<>();

    private long totalCount;
}