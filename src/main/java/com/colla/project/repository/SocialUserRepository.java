package com.colla.project.repository;

import com.colla.project.entity.SocialUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialUserRepository extends JpaRepository<SocialUser, Long> {

    SocialUser findByUsername(String username);
}