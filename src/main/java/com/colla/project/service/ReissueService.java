package com.colla.project.service;

import com.colla.project.entity.Refresh;
import com.colla.project.jwt.JWTUtil;
import com.colla.project.repository.RefreshRepository;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class ReissueService {

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public String reissueAccessToken(String refreshToken) {
        try {
            jwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Refresh 토큰이 만료되었습니다.");
        }

        String category = jwtUtil.getCategory(refreshToken);
        if (!category.equals("refresh")) {
            throw new RuntimeException("유효하지 않은 Refresh 토큰입니다.");
        }

        boolean isExist = refreshRepository.existsByRefresh(refreshToken);
        if (!isExist) {
            throw new RuntimeException("유효하지 않은 Refresh 토큰입니다.");
        }

        String username = jwtUtil.getUsername(refreshToken);
        String role = jwtUtil.getRole(refreshToken);

        // 새로운 JWT 생성
        String newAccessToken = jwtUtil.createJwt("access", username, role, 600000L);
        String newRefreshToken = jwtUtil.createJwt("refresh", username, role, 86400000L);

        // DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        refreshRepository.deleteByRefresh(refreshToken);
        addRefreshEntity(username, newRefreshToken, 86400000L);

        return newAccessToken;
    }

    public String reissueRefreshToken(String refreshToken) {
        String username = jwtUtil.getUsername(refreshToken);
        String role = jwtUtil.getRole(refreshToken);
        return jwtUtil.createJwt("refresh", username, role, 86400000L);
    }

    private void addRefreshEntity(String username, String refreshToken, Long expiredMs) {
        Date expiration = new Date(System.currentTimeMillis() + expiredMs);

        Refresh refreshEntity = new Refresh();
        refreshEntity.setUsername(username);
        refreshEntity.setRefresh(refreshToken);
        refreshEntity.setExpiration(expiration.toString());

        refreshRepository.save(refreshEntity);
    }
}
