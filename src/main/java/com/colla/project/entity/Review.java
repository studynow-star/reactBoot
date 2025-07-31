package com.colla.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    // 다대일 관계 : 여러 리뷰는 하나의 고객에 속함
    @ManyToOne
    private Customer customer;

    // 다대일 관계 : 여러 리뷰는 하나의 병원에 속함
    @ManyToOne
    private Hospital hospital;
}
