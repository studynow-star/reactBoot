import axios from "axios";
import {API_BASS_URL} from "./api-config";

// 백 서버에 데이터 요청
export function backRequest(url, data){
    return axios.post(
        API_BASS_URL + url,
        data
    ).then((response) => {
        return response.data;
    }).catch((error) =>
        console.log(error)
    )
}

// 로그인 요청
export function loginRequest(url, data){
    return axios.post(
        API_BASS_URL + url,
        data
    ).then((response) => {
        return response;
    }).catch((error) =>
        console.log(error)
    )
}

// 인증이 필요한 요청
export function backRequestWithAuth(url, method = 'GET', data = {}) {
    const accessToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰을 가져옴

    return axios({
        url: API_BASS_URL + url,
        method: method,
        data: data,
        headers: {
            'Authorization': `Bearer ${accessToken}`  // JWT 토큰을 Authorization 헤더에 추가
        },
        withCredentials: true  // 쿠키를 포함하는 경우
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
        throw error;
    });
}
