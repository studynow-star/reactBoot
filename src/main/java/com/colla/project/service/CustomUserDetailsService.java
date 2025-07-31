package com.colla.project.service;

import com.colla.project.dto.CustomUserDetails;
import com.colla.project.entity.Customer;
import com.colla.project.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        //DB에서 조회
        Customer userData = customerRepository.findByUsername(username);

        if (userData == null) {
            // 사용자 정보가 없을 경우 예외를 던짐
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        //UserDetails에 담아서 return하면 AutneticationManager가 검증 함
        return new CustomUserDetails(userData);
    }
}
