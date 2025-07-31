package com.colla.project.service;

import com.colla.project.dto.*;
import com.colla.project.entity.SocialUser;
import com.colla.project.repository.SocialUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final SocialUserRepository socialUserRepository;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());

        } else if (registrationId.equals("google")) {

            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());

        } else if (registrationId.equals("kakao")) {
                oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
            } else {

            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        //리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듬
        String username = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();

        SocialUser existData = socialUserRepository.findByUsername(username);

        if(existData == null){

            SocialUser socialUserEntity = new SocialUser();
            socialUserEntity.setUsername(username);
            socialUserEntity.setEmail(oAuth2Response.getEmail());
            socialUserEntity.setName(oAuth2Response.getName());
            socialUserEntity.setRole("ROLE_USER");

            socialUserRepository.save(socialUserEntity);

            SocialUserDTO socialUserDTO = new SocialUserDTO();
            socialUserDTO.setUsername(username);
            socialUserDTO.setName(oAuth2Response.getName());
            socialUserDTO.setRole("ROLE_USER");

            return new CustomOAuth2User(socialUserDTO);
        }
        else {

            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());

            socialUserRepository.save(existData);

            SocialUserDTO socialUserDTO = new SocialUserDTO();
            socialUserDTO.setUsername(existData.getUsername());
            socialUserDTO.setName(oAuth2Response.getName());
            socialUserDTO.setRole(existData.getRole());

            return new CustomOAuth2User(socialUserDTO);
        }
    }
}