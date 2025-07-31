import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reviews';

const token = localStorage.getItem('accessToken');

// 리뷰 저장
export const saveReview = (review, username, careCode) => {
    console.log("Sending careCode:", careCode); // 디버깅을 위한 로그
    return axios.post(API_BASE_URL, {
        text: review,
        username: username,
        careCode: careCode // careCode가 포함된 요청
    }, {
        headers: {
            Authorization: token
        }
    });
};

// 리뷰 삭제
export const deleteReview = (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
            Authorization : token
        }
    });
};