import {useEffect, useState} from "react";
import {saveReview} from "../Review";
import {useParams} from "react-router-dom";
import axios from "axios";
import {API_BASS_URL} from "../api-config";
import './review.css'
import Loding from "../Loding";

function InsertReview(){
    
    // :careCode로 받아오는 Url에 있는 파라미터
    const {careCode} = useParams();

    // 병원 상세정보
    const [detailData, setDetailData] = useState(null);

    // 상세정보 로딩 
    const [loading, setLoading] = useState(false);

    // 이 페이지에 들어왔을 때 실행되는 구문
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
                        <span onClick={() => window.history.back()} className='windowBack'><i
                            className="fa-solid fa-arrow-left"></i>  뒤로가기</span>

                        <h2><span>{detailData.hospitalName}</span>에 대한 리뷰를 남겨주세요.</h2>
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