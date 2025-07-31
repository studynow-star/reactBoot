package com.colla.project.config;

import com.colla.project.jwt.*;
import com.colla.project.oauth2.CustomSuccessHandler;
import com.colla.project.repository.RefreshRepository;
import com.colla.project.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final RedisUtil redisUtil;
    private final RedisTemplate<String, String> redisTemplate;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CSRF 비활성화
        http.csrf(csrf -> csrf.disable());

        // 폼 로그인 비활성화
        http.formLogin(form -> form.disable());

        // HTTP Basic 비활성화
        http.httpBasic(basic -> basic.disable());

        //oauth2
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler)
                );

        // URL 접근 권한 설정
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/", "/join", "/api/search/cityDistrictDetail", "/api/search/wordSearch", "/api/search/detailInfo/{careCode}", "/api/reviews/{careCode}/{page}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/logout").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated() // 리뷰 작성은 인증된 사용자만 가능
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated() // 리뷰 삭제는 인증된 사용자만 가능
                .requestMatchers("/admin").hasRole("ADMIN")
                .requestMatchers("/reissue").permitAll()
                .anyRequest().authenticated());

        // CORS 설정
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // JWTFilter 등록 (LoginFilter 이후에 추가)
        http.addFilterBefore(new JWTFilter(jwtUtil, redisUtil), UsernamePasswordAuthenticationFilter.class);

        // LoginFilter 등록 (UsernamePasswordAuthenticationFilter 전에 추가)
        http.addFilterBefore(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, refreshRepository, redisTemplate), UsernamePasswordAuthenticationFilter.class);

        // logout
//        http.addFilterBefore(new CustomLogoutFilter(jwtUtil), LogoutFilter.class);

        // 세션 관리: JWT를 사용하므로 세션을 사용하지 않도록 설정
        http.sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // 클라이언트 도메인 허용
        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.addExposedHeader("Authorization");
        source.registerCorsConfiguration("/**", config);
        return source;
    }


}