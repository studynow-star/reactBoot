package com.colla.project.service;

import com.colla.project.dto.JoinDTO;
import com.colla.project.entity.Customer;
import com.colla.project.jwt.RedisUtil;
import com.colla.project.repository.CustomerRepository;
import com.colla.project.repository.RefreshRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final RefreshRepository refreshRepository;

    private final RedisUtil redisUtil;

    public void joinProcess(JoinDTO joinDTO){

        String username = joinDTO.getUsername();
        String password = joinDTO.getPassword();

        Boolean isExist = customerRepository.existsByUsername(username);

        if (isExist){
            return;
        }

        Customer customer = Customer.builder()
                        .username(username)
                        .password(bCryptPasswordEncoder.encode(password))
                        .role("ROLE_USER")
                        .build();

        customerRepository.save(customer);
    }

    public String logout(String accessToken, String username) {
        System.out.println("서비스 들어옵니다");
        
        // refreshToken 테이블의 refreshToken 삭제
        refreshRepository.deleteByUsername(username);

        // 레디스에 accessToken 사용못하도록 등록
        redisUtil.setBlackList(accessToken, "accessToken", 5);

        return "로그아웃 완료";
    }
}