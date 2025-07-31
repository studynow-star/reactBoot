import {useEffect, useRef, useState} from "react";
import './Info.css'
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {API_BASS_URL} from "./api-config";
import Loding from "./Loding";
import images from "./data/pop_imagesData";
import {evaluation} from "./data/evaluationData";
import {deleteReview} from './Review';

function HospitalInfo() {

    // Route로 설정해놓은 url에서 :careCode를 가져오는 구문
    const {careCode} = useParams();

    // 병원의 평가정보를 가져오는 API URL
    const HosEvaluationUrl = 'http://apis.data.go.kr/B551182/hospAsmInfoService/getHospAsmInfo';

    // 병원에 있는 의사 정보를 가져오는 API URL
    const specialTreatmentUrl = 'https://apis.data.go.kr/B551182/MadmDtlInfoService2.6/getSpcSbjtSdrInfo2.6';

    // API에 쓰이는 서비스키
    const serviceKey = 'JVQ3Gw/JIpbaj0/nAr2ZwbhCdpoUkZJaL6HIuFHrkQaJm5PYEGW3eT18GTByE1RIhqrf//pxjGzgTFL3NuNItg==';

    // 병원 & 약국 하나의 모든 데이터
    const [detailData, setDetailData] = useState(null);

    // 평가정보 데이터
    const [evaluationData, setEvaluationData] = useState(null);

    // 의사 수 데이터
    const [doctorData, setDoctorData] = useState(null);

    // 총 의사 수 (초기 값은 0)
    const [doctorCount, setDoctorCount] = useState(0);

    // 데이터를 다 가져오지 못했을 때 로딩 보여주기위한 변수 (더 많은 데이터를 로딩할 때는 기다리는 시간이 있을 수 있음)
    const [loading, setLoading] = useState(false);

    // 메뉴를 클릭했을 때 선택자를 가져오기 위한 useRef
    const menuRefs = useRef([]);

    // 메뉴를 클릭했을 때 각각의 index를 가져와서 비교하기 위한 변수
    const [activeIndex, setActiveIndex] = useState(0);

    // 기본정보, 평가정보, 리뷰를 클릭했을 때 메뉴를 바꾸기위한 함수
    const menuClick = (index) => {
        setActiveIndex(index)

        // 모든 요소에서 'on' 클래스를 제거하고, 클릭한 요소에만 추가
        menuRefs.current.forEach((ref, idx) => {
            if (ref) {
                if (idx === index) {
                    ref.classList.add('on');
                } else {
                    ref.classList.remove('on');
                }
            }
        });
    }

    // 이 페이지에 들어왔을 떄 바로 실행되는 함수
    useEffect(() => {
        console.log(careCode)

        // 먼저 백에서 해당 백에서 해당 병원 or 약국의 모든 정보를 가져온다
        axios.get(API_BASS_URL + `/api/search/detailInfo/${careCode}`)
            .then((response) => {
                setDetailData(response.data)

                // 만약 가져온 정보가 약국이면 바로 보여줌
                // 약국 평가정보 같은 경우에는 API가 없었기 때문에 보여줄 수 없었음
                if (response.data.hospitalType === '약국') {
                    setLoading(true)
                } else { // 약국이 아닐 경우에는 API를 통해 다른 의사정보 + 평가정보를 가져온 다음 페이지를 보여줌
                    axios.get(specialTreatmentUrl + '?ServiceKey=' + serviceKey + '&ykiho=' + careCode + '&_type=json&numOfRows=100').then((response) => {
                        let docData = response.data.response.body.items.item;
                        console.log(docData)
                        setDoctorData(docData); // 의사정보

                        // 총 의사 수 계산을 위한 total
                        let total = 0;

                        // 의사수가 1명이어서 바로 dtlSdeCnt로 들어올 때
                        if (docData.dtlSdrCnt > 0) {
                            total = docData.dtlSdrCnt;

                            setDoctorCount(total);
                        } else {
                            // 의사 수가 2명 이상이고 카테고리가 2개 이상일 때
                            for (let i = 0; i < docData.length; i++) {
                                let count = docData[i].dtlSdrCnt;

                                total += count;
                            }
                            setDoctorCount(total);
                        }

                        console.log(total)

                        // 의사정보 가져온 다음 평가정보 가져오는 구문
                        axios.get(HosEvaluationUrl + '?ServiceKey=' + serviceKey + '&ykiho=' + careCode)
                            .then((response) => {
                                let resData = response.data.response.body.items.item;
                                let arr = {};

                                // 평가정보를 가져올 때 평가 등급들이 asmGrd로 시작하기 떄문에 
                                // 평가 등급만 골라내기 위해 변수 생성
                                let EvaluationStart = 'asmGrd';

                                // Object, 객체로 데이터가 넘어오기 떄문에 key값만 뽑아서
                                // EvaluationStart변수와 대조 후 평가 데이터만 뽑는다.
                                Object.keys(resData).map(element => {
                                    let sub = element.substring(0, 6);
                                    console.log(sub)

                                    if (EvaluationStart === sub)
                                        arr[element] = resData[element];
                                })

                                // 평가 데이터에 넣어주고
                                setEvaluationData(arr)

                                // 로딩을 풀어준다.
                                setLoading(true)
                            }).catch((error) => {
                            setLoading(true)
                            console.log(error)
                        })
                    }).catch((error) => {
                        console.log(error)
                        setLoading(true);
                    })
                }
            }).catch((error) => console.log(error));
    }, [careCode]);

    return (
        <>
            {
                !loading ? <Loding/> :
                    <>
                        <div className='popHeader'>
                            <h1>{detailData.hospitalName}</h1>
                        </div>

                        <div className='pop_content'>
                            <div className='pop_tabList'>
                                <ul>
                                    <li><span className={activeIndex === 0 ? 'on' : ''}
                                              ref={(el) => (menuRefs.current[0] = el)}
                                              onClick={() => menuClick(0)}>병원정보</span></li>
                                    {
                                        detailData.hospitalType === '약국' ? '' :
                                            (evaluationData === null ? '' :
                                                    <li><span className={activeIndex === 1 ? 'on' : ''} ref={(el) => (menuRefs.current[1] = el)}
                                                              onClick={() => menuClick(1)}>평가정보</span></li>
                                            )
                                    }
                                    <li><span className={activeIndex === 2 ? 'on' : ''}
                                              ref={(el) => (menuRefs.current[2] = el)}
                                              onClick={() => menuClick(2)}>리뷰</span></li>
                                </ul>
                            </div>

                            {
                                detailData.hospitalType === '약국' ?
                                    <DefaultInfo detailData={detailData} doctorData={doctorData}
                                                 doctorCount={doctorCount}/> : (activeIndex === 0 ?
                                            <DefaultInfo detailData={detailData} doctorData={doctorData}
                                                         doctorCount={doctorCount}/> :
                                            activeIndex === 1 ?
                                                <EvaluationInfo evaluationData={evaluationData} evaluation={evaluation}
                                                                images={images}/> :
                                                <Reviews
                                                    careCode={careCode}  // careCode도 전달해야 합니다
                                                />
                                    )
                            }

                            <div className="infoFooter">
                                <div>
                                    <i className='icon-quick'></i>
                                    &nbsp;해당 의료기관이 건강보험심사평가원에 신고한 내용을 기준으로 작성되었습니다.
                                </div>
                            </div>
                        </div>

                        <div className='infoClose'>
                            <button onClick={() => window.self.close()}><span>닫기</span></button>
                        </div>
                    </>
            }
        </>
    )
}

// 기본정보 => 의사정보 + 의사 수
// 나중에 className 바꿀 예정 (지금은 군대 사지방에서 하는중입니다...ㅠㅠㅠ)
// popH1 ~ H4까지 맞는 이름으로 바꾸겠음, 코드 작성할 때는 귀찮았나?
function DefaultInfo({detailData, doctorData, doctorCount}) {
    return (
        <>
            <div className='tab_content'>
                <div className='pop_tab_box'>
                    <ul>
                        <li><span className='on'>기본정보</span></li>
                    </ul>
                </div>
            </div>

            <div className="sub_tab_content">
                <ul>
                    <li>
                        <span className='popH1'>병원구분</span>
                        <p>{detailData.hospitalType}</p>
                    </li>
                    <li>
                        <span className='popH2'>주소</span>
                        <p>{detailData.address}
                            <Link to={'http://map.naver.com/index.nhn?elng='+detailData.x_coordinate+'&elat='+detailData.y_coordinate+'&etext='+detailData.hospitalName+'&menu=route&pathType=1'} className='roadFind' target='_blank'>길찾기</Link>
                        </p>
                    </li>
                    <li>
                        <span className='popH3'>전화번호</span>
                        <p>{detailData.phoneNumber}</p>
                    </li>
                    <li>
                        <span className='popH4'>홈페이지</span>
                        <p>
                            {
                                detailData.hospitalURL === '' ?
                                    <span className='urlNone'></span> :
                                    <a href={detailData.hospitalURL} target='_blank' className='hospitalUrl'>{detailData.hospitalURL}</a>
                            }
                        </p>

                    </li>
                </ul>
            </div>

            <h4 className='doctorTitle'>진료과목 및 의사 현황</h4>

            {
                detailData.hospitalType === '약국' ? '' :
                    <div className="doctorInfo">
                        <table className='doctorTable'>
                            <tbody>
                                <tr>
                                    <th scope='col' style={{width: "30%"}}>의사수</th>
                                    <td scope='col'>총 인원 : {doctorCount}명</td>
                                </tr>
                                <tr>
                                    <th scope='col'>진료과목별(전문의수)</th>
                                    <td>
                                        <ul className='doctorUl'>
                                            {
                                                doctorData.dtlSdrCnt > 0 ?
                                                    <li>{doctorData.dgsbjtCdNm} ({doctorData.dtlSdrCnt})</li> :
                                                    doctorData.map(element =>
                                                        <li>{element.dgsbjtCdNm} ({element.dtlSdrCnt})</li>
                                                    )
                                            }
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            }
        </>
    )
}

// 평가정보
function EvaluationInfo({evaluationData, evaluation, images}) {
    const evaluationKeys = Object.keys(evaluation);

    return (
        <>
            <div className='tab_content'>
                <div className='pop_tab_box'>
                    <ul>
                        <li><span className='on' style={{cursor: 'pointer'}}>전체항목 최근결과</span></li>
                    </ul>
                </div>
            </div>

            <div className="evaluationBox">
                <ul>
                    <li><strong style={{fontWeight: "500"}}>전체항목 최근결과</strong> 버튼을 클릭하시면 전체 평가 항목의 결과를 보실 수 있습니다.</li>
                    <li>평가결과 클릭 시 상세평가정보를 보실 수 있습니다.</li>
                    <li>고혈압, 당뇨병, 천식의 경우 평가결과가 양호한 '의원'만 공개하고 있습니다.</li>
                </ul>
            </div>

            {
                Object.keys(evaluation).map((ele, i) => {
                    return (
                        <>
                            <h5 className="illnessTit">{evaluationKeys[i]}</h5>

                            <div className="pop_img">
                                <img src={images[(i + 1)]} alt="평가정보 이미지" style={{display: "block"}}/>

                                <ul>
                                    {
                                        Object.keys(evaluation[evaluationKeys[i]]).map((element, index) =>
                                            <li>
                                                {evaluation[evaluationKeys[i]][element]}

                                                {
                                                    evaluationData[element] !== undefined ? <span
                                                        className={evaluationData[a] === '양호' ? 'grade evaluationGood' : (evaluationData[element]) >= 1 ? 'grade evaluationRating' + evaluationData[element] : ''}>{
                                                        evaluationData[element] === '양호' ? evaluationData[element] : (evaluationData[element] >= 1) ? evaluationData[element] + '등급' : '등급제외'
                                                    }</span> : <span>평가대상제외</span>
                                                }
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </>
                    )
                })
            }
        </>
    )
}

// 리뷰정보
function Reviews({careCode}) {

    // 로컬 스토리지에 저장되어 있는 유저의 토큰
    const token = localStorage.getItem('accessToken');

    // 로컬 스토리지에 저장되어 있는 유저의 id
    const username = localStorage.getItem('username');

    // 리뷰 데이터 + 페이징 데이터 모음
        const [reviewData, setReviewData] = useState(null);

    // 로딩
    const [loading, setLoading] = useState(false)

    // 페이지에 들어올 때 리뷰 가져오고 로딩 푼다.
    useEffect(() => {
        axios.get(API_BASS_URL + '/api/reviews/'+careCode + '/1').then((response) => {
                setReviewData(response.data)
                console.log(response.data)
                setLoading(true)
            }
        ).catch((error) => console.log(error))
    }, []);

    // 페이지네이션을 위한 반복문을 통한 배열 생성
    const pageArr = () => {
        let arr = [];

        for(let i = reviewData.start; i <= reviewData.end; i++){
            arr.push(i)
        }

        return arr;
    }

    // 페이지 숫자를 눌렀을 때 실행되는 요청
    const pageRequest = (page) => {
        axios.get(API_BASS_URL + '/api/reviews/'+careCode+ '/'+page)
            .then((response) => setReviewData(response.data))
            .catch((error) => console.log(error))
    }

    // 페이지네이션을 눌렀을 때 이전, 다음, 숫자를 판별해서 백에 요청
    const pageClick = (nOp, page) => {
        if(nOp === 'next'){
            pageRequest(reviewData.start - 1);
        }else if(nOp === 'prev'){
            pageRequest(reviewData.end + 1);
        }else {
            pageRequest(page);
        }
    }

    // 리뷰 삭제 함수
    const handleDeleteReview = (reviewId) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm('정말 리뷰를 삭제하시겠습니까?')){
            deleteReview(reviewId).then(() => {
                alert('삭제되었습니다.')
                window.location.reload();
            }).catch(error => console.error("Error deleting review:", error));
        }
    };

    return (
        <div className="reviews">
            <h2>리뷰</h2>
            <ul>
                {
                    !loading ? <Loding/> :
                        reviewData.dtoList.length === 0 ?
                            <p className='noReview'>리뷰가 없습니다.</p> :
                            reviewData.dtoList.map((review, index) => (
                                    <li key={index} className='hospitalReview'>
                                        {review.username}님 - {review.text}
                                        {
                                            // 토큰을 가지고 있고 로그인한 username이랑 리뷰 작성한 username이 같으면 리뷰 삭제 버튼 생성
                                            token && (username === review.username) ?
                                                <button onClick={() => handleDeleteReview(review.id)}>X</button> : ''
                                        }
                                    </li>
                                )
                            )
                }
            </ul>

            <div className="pageButton">
                <ul>
                    {
                        !loading ? <Loding /> :
                        <div>
                            {
                                reviewData.prev ? <li><span onClick={() => pageClick('prev')}>이전</span></li> : ''
                            }
                            {
                                pageArr().map(a =>
                                    <li><span className={reviewData.page === a ? 'active' : ''} onClick={() => pageClick('', a)}>{a}</span></li>
                                )
                            }
                            {
                                reviewData.next ? <li><span onClick={() => pageClick('next')}>다음</span></li> : ''
                            }
                        </div>
                    }
                </ul>
            </div>

            {
                token ? <Link to={'/insertReview/' + careCode} className='bt more-bt'>
                    <span className="fl"></span><span className="sfl"></span><span className="cross"></span><i></i>
                    <p>리뷰작성</p>
                </Link> : ''
            }
        </div>
    );
}

export default HospitalInfo;