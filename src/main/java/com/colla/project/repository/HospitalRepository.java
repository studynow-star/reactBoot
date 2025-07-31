package com.colla.project.repository;

import com.colla.project.entity.Hospital;
import com.colla.project.repository.search.HospitalSearch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, String>, HospitalSearch {
}