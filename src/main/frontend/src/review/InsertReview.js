import {useEffect, useState} from "react";
import {saveReview} from "./Review";
import {useParams} from "react-router-dom";
import axios from "axios";
import {API_BASS_URL} from "../api-config";
import './review.css'
import Loding from "../loading/Loding";

function InsertReview(){
    
    // :careCode로 받아오는 Url에 있는 파라미터
    const {careCode} = useParams();

    // 병원 상세정보
    const [detailData, setDetailData] = useState(null);

    // 상세정보 로딩 
    const [loading, setLoading] = useState(false);

    // 이 페이지에 들어왔을 때 실행되는 구문
    // 현재 병원에 등록되어 있는 정보 가져오기
    useEffect(() => {
        axios.get(API_BASS_URL + `/api/search/detailInfo/${careCode}`).then((response) => {
            setDetailData(response.data)
            setLoading(true)
        })
            .catch((error) => console.log(error))
    }, []);

    // 사용자가 작성하는 리뷰
    const [review, setReview] = useState('');

    // 리뷰 작성 버튼을 눌렀을 때 실행되는 함수
    const handleReviewSubmit = () => {
        let username = localStorage.getItem('username');

        // 리뷰 작성 칸에 아무 글자도 입력하지 않았을 경우..
        // (나중에는 특수문자만 작성하거나 최소 글자조건을 추가하고 여러가지 욕설을 필터링하는 구문을 추가적으로 작성해야함.)
        if(review === ''){
            alert('리뷰를 남겨주세요.')
            return;
        }

        // 리뷰 저장 함수
        saveReview(review, username, careCode).then(response => {
            setReview("");  // 입력 필드 초기화
            window.location.href = '/hospitalInfo/'+careCode;
        }).catch(error => console.error("Error saving review:", error));
    };

    return (
        <>
            {
                !loading ? <Loding/> :
                    <div className="review-form">
                        <span onClick={() => window.history.back()} className='windowBack'>
                            <i className="fa-solid fa-arrow-left"></i>  뒤로가기
                        </span>

                        <h2>
                            <span>{detailData.hospitalName}</span>에 대한 리뷰를 남겨주세요.
                        </h2>

                        <textarea
                            onChange={(e) => setReview(e.target.value)}
                            value={review}
                        />

                        <button onClick={handleReviewSubmit}>리뷰 작성</button>
                    
                    </div>
            }
        </>
    )
}

export default InsertReview;