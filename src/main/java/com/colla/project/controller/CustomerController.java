package com.colla.project.controller;

import com.colla.project.dto.CustomUserDetails;
import com.colla.project.dto.JoinDTO;
import com.colla.project.service.CustomerService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ResponseBody
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/join")
    public String joinProcess(@RequestBody JoinDTO joinDTO){
        customerService.joinProcess(joinDTO);

        return "ok";
    }

    // 로그아웃
    @PostMapping("/api/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        System.out.println(request.getHeader("Authorization"));
        System.out.println(customUserDetails.getUsername());
        return ResponseEntity.ok(customerService. logout(request.getHeader("Authorization"), customUserDetails.getUsername()));
    }
}
