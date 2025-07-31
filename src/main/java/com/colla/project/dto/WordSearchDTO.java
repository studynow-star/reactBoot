package com.colla.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WordSearchDTO {

    private String word;

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 20;

    public Pageable getPageable(){
        return PageRequest.of(this.page -1, this.size);
    }
}
