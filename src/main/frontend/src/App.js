import React, {useEffect, useRef, useState} from "react";
import areaData from "./data/areaData";
import './App.css'
import {backRequest} from "./BackRequest";
import {Collapse} from '@kunukn/react-collapse'
import Map from "./map/Map";
import {Link, Route, Routes} from "react-router-dom";
import HospitalInfo from "./HospitalInfo";
import LoginForm from "./login/LoginForm";
import SignupForm from "./join/SignupForm";
import InsertReview from "./review/InsertReview";
import axios from "axios";
import {API_BASS_URL} from "./api-config";

function App() {

    // 변수               // 함수setCityArea(값)             // default값
    // 시/도 코드
    const [cityArea, setCityArea] = useState('시/도');

    // 시/군/구 코드
    const [districtArea, setDistrictArea] = useState('시/군/구');

    // 읍/면/동 코드
    const [addressDetailArea, setAddressDetailArea] = useState('읍/면/동');

    // 표시하는 데이터는 20개씩인데 검색된 총 결과는 몇개인데 확인하는 변수
    const [searchCount, setSearchCount] = useState('0');

    // 받은 병원 & 약국 데이터
    const [hospitalData, setHospitalData] = useState([]);

    // 스크롤 함수를 실행시키기 위한 ul 선택자 ref
    const listRef = useRef(null);

    // 몇 번 스크롤 했는지 만약 확인을 눌러 재검색 할 때 1로 초기화
    const scrollCount = useRef(1);

    // 슬라이드 toggle
    const [toggle, setToggle] = useState(false);

    // 병원 & 약국을 검색했을 때 필요한 마커 데이터들
    const [markerData, setMarkerData] = useState([]);

    // 페이지에 처음 들어왔을 때 위치 동의 받은 후 지도에 표시
    const [userLocation, setUserLocation] = useState({});

    // 검색어 단어
    const [word, setWord] = useState('');

    // 단어로 검색했을 때 검색된 결과가 없을 때
    const [wordSearchNo, setWordSearchNo] = useState(false);

    // 단어 검색으로 scroll했을 때
    const [wordSearchFrag, setWordSearchFrag] = useState(false);

    // 스토리지에 저장된 token 가져오기
    const token = localStorage.getItem('accessToken');

    // 스토리지에 저장된 username 가져오기
    const username = localStorage.getItem('username');

    // 유저의 위치를 받아오는 함수
    // define the function that finds the users geolocation
    const getUserLocation = () => {
        // if geolocation is supported by the users browser
        if (navigator.geolocation) {
            // get the current users location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // save the geolocation coordinates in two variables
                    const { latitude, longitude } = position.coords;
                    // update the value of userlocation variable
                    setUserLocation({lat : latitude, lng : longitude});
                },

                // if there was an error getting the users location
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        }

        // if geolocation is not supported by the users browser
        else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    // 화면 들어왔을 때 함수 실행해서 유저의 좌표 가져오기
    useEffect(() => {
        // 어떤 상황에서 내가 실행시키고 싶은거
        getUserLocation();

        // 혹시나 소셜로그인을 통해 cookie에 token이 있을 수 있기 때문에
        // HttpOnly가 설정되지 않은 쿠키에서 토큰을 가져오기
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('Authorization='))
            ?.split('=')[1];

        const username = document.cookie
            .split('; ')
            .find((row) => row.startsWith('username='))
            ?.split('=')[1];

        if(token && username) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('username', username);
        }
    }, []);
    ///////////////////////////////////////////////////////////////////////////////

    // 시/도 클릭했을 때 함수
    const cityClick = (city) => {
        console.log(city.element)
        if (city.element === undefined)
            setCityArea('시/도');
        else
            setCityArea(city.a);

        setDistrictArea('시/군/구');
        setAddressDetailArea('읍/면/동');
    }

    // 시/군/구 클릭했을 때 함수
    const districtClick = (district) => {
        console.log(district.element)
        if (district.element === undefined)
            setDistrictArea('시/군/구');
        else
            setDistrictArea(district.a);
        setAddressDetailArea('읍/면/동');
    }

    // 읍/면/동 클릭했을 때 함수
    const addressDetailClick = (detail) => {
        console.log(detail.element);
        if (detail.a === undefined)
            setAddressDetailArea('읍/면/동');
        else
            setAddressDetailArea(detail.a);
    }

    // 검색 결과 창 슬라이드를 위한 변수 (왼 <=> 오)
    let [fade, setFade] = useState('');

    const searchResultClick = () => {
        if (fade === 'hide')
            setFade('');
        else
            setFade('hide')
    }

    // 병원명 & 약국명 검색할 때 한 자씩 저장
    const saveWord = e => {
        setWord(e.target.value);
    }

    // 취소 버튼을 클릭했을 때 slideToggle이 안되기때문에
    // 선택한 지역을 초기화
    const resetSearch = () => {
        console.log('취소')
        setCityArea('시/도');
        setDistrictArea('시/군/구');
        setAddressDetailArea('읍/면/동');
        setToggle(!toggle)
    }

    // 확인 버튼 눌렀을 때 해당되는
    const addressSearch = () => {
        if (cityArea === '시/도')
            alert('검색 시/도를 선택해 주세요.');
        else {
            console.log('검색')

            // scrollCount 1로 초기화
            scrollCount.current = 1;

            // 지역 선택 숨기기
            setToggle(!toggle)

            // 단어 검색으로 하는게 아니다.
            setWordSearchFrag(false)

            if(word !== '')
                setWord('')

            backRequest('/api/search/cityDistrictDetail', {
                cityCode: cityArea, // 도시코드
                districtCode: districtArea, // 시/군/구 코드
                addressDetailCode: addressDetailArea, // 읍/면/동 코드
                page: scrollCount.current // 스크롤 몇 번 했는지 (처음했으면 1로 서버에 보냄)
            }).then((response) => {
                if(response.dataList.length === 0){
                    console.log('데이터 없음')

                    // 데이터가 없을 때 true로 해줌으로써 데이터가 없음을 시각적으로 나타내 줄 수 있음
                    setWordSearchNo(true)
                }else {
                    // 단어 검색이 아니다.
                    setWordSearchNo(false)

                    // 병원 데이터 변수에 넣기
                    setHospitalData(response.dataList);

                    // 찾은 병원 OR 약국 갯수를 보기 쉽게 바꾸기
                    setSearchCount(response.totalCount.toLocaleString('ko-KR'));

                    // 지도의 중심을 바꿔서 보여야하기 때문에 맨 첫번째 데이터의 좌표로 교체
                    setUserLocation([response.dataList[0].x_coordinate, response.dataList[0].y_coordinate])

                    // 재검색하면 2번 검색되는 이슈가 있어서 스크롤의 높이를 0으로 맞춰서 다시 스크롤 할 수 있게 함
                    listRef.current.scrollTop = 0;

                    // 클러스터를 위한 마커 데이터 생성
                    unLimitScrollMarkerAdd(response.dataList, true);
                }
            })
        }

        console.log(cityArea, districtArea, addressDetailArea)
    }

    // 병원명 또는 약국명을 사용자가 입력해 검색한 경우
    const wordSearch = (e) => {
        e.preventDefault(); //다른 페이지 이동이나 링크 이동 방지

        // 검색어가 없을 때
        if(word === '')
            alert('검색어를 입력해주세요.')
        else {
            // 검색어를 통해 새로 검색하는 것이기 때문에 이전에 검색했을 경우를 대비
            if (scrollCount.current > 1)
                scrollCount.current = 1;

            // 단어로 검색하는게 맞으니 true
            setWordSearchFrag(true)

            // 지역으로 검색하는 것이 아니기 때문에 초기화
            setCityArea('시/도');
            setDistrictArea('시/군/구');
            setAddressDetailArea('읍/면/동');

            backRequest('/api/search/wordSearch', {
                word : word,
                page : scrollCount.current
            }).then((response) => {
                console.log(response)
                // 만약 데이터가 없을 때
                if (response.dataList.length === 0) {
                    console.log('데이터 없음')
                    setWordSearchNo(true)
                } else {
                    console.log('데이터 있음')

                    setWordSearchNo(false)

                    setHospitalData(response.dataList);

                    setSearchCount(response.totalCount.toLocaleString('ko-KR'));

                    setUserLocation([response.dataList[0].x_coordinate, response.dataList[0].y_coordinate])

                    unLimitScrollMarkerAdd(response.dataList, true);
                }
            });
        }
    }

    // 스크롤을 통해 추가 데이터를 요청할 떄 실행하는 함수
    // 맥에서는 scroll값이 소수점까지 나오기 때문에 오차 값을 계산해주어야 해서 맥에서만 살짝 코드 바뀜
    const unLimitScroll = () => {
        const element = listRef.current;

        if (element) {
            // 스크롤이 끝까지 도달했는지 확인
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                scrollCount.current += 1; // 현재 스크롤 카운트에 1 추가

                // 사용자가 단어로 검색했을 때
                if(wordSearchFrag){
                    backRequest('/api/search/wordSearch', {
                        word : word,
                        page: scrollCount.current
                    }).then((response) => {
                        // 계속 데이터를 추가적으로 받는것이다 보니 스프레드 연산자를 통해 현재 있던 데이터 뒤쪽에 추가 삽입
                        setHospitalData([...hospitalData, ...response.dataList]);

                        // 마커 데이터도 추가
                        unLimitScrollMarkerAdd(response.dataList, false);
                    })
                }else {
                    backRequest('/api/search/cityDistrictDetail', {
                        cityCode: cityArea,
                        districtCode: districtArea,
                        addressDetailCode: addressDetailArea,
                        page: scrollCount.current
                    }).then((response) => {
                        setHospitalData([...hospitalData, ...response.dataList]);

                        unLimitScrollMarkerAdd(response.dataList, false);
                    })
                }
            }
        }
    }

    // 스크롤을 통해 맨 밑에 도달했을 때 얻어온 데이터로 재검색한건지 판단후 마커 데이터 추가
    const unLimitScrollMarkerAdd = (data, research) => {
            // 배열                  // a = 요소
            // 배열에 반복문을 통해 객체를 하나씩 채움
        let sample = data.map(element => ({
            "code": [element.x_coordinate, element.y_coordinate],
            "data" : element // 모든 데이터
        }));

        // 재검색일 경우
        if(research){
            setMarkerData(sample);
        }else {
            // 재검색이 아닐경우 markerData에 있던 데이터를 복사해서 데이터를 추가
            // 스프레드 연산자 => 배열 복사
            setMarkerData([...markerData, ...sample]);
        }
    }

    // 로그아웃 함수
    const logout = () => {
        axios.post(API_BASS_URL + '/api/logout', {} ,{
            headers: {
                Authorization : token
            }
        })
            .then(() => {
                console.log('로그아웃 로직은 성공')
                // 백에서 로그아웃 로직이 성공했을 때 스토리지에 있는 token과 username을 삭제
                localStorage.removeItem('accessToken');
                localStorage.removeItem('username');

                // 쿠키에 있는 token & username 삭제
                document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                // 로그아웃에 성공하면 기본페이지로 이동
                window.location.href = '/';
            })
            .catch((error) => console.log(error))
    }

    return (
        <>
            <Routes>
                <Route path='/' element={
                    <>
                        // 현재 페이지에 지도 표시 + 검색을 했을 경우 마커도 표시 + 클러스터 적용
                        <Map userLocation={userLocation} markerData={markerData} />

                        <div className='searchWrap'>
                            <div className='searchMain' onClick={() => setToggle(!toggle)}>
                                <span id='cityCode'>{cityArea}</span>
                                <span id='districtCode'>{districtArea}</span>
                                <span id='addressDetailCode'>{addressDetailArea}</span>
                            </div>

                            <Collapse
                                isOpen={toggle}
                                transition="height 500ms"
                            >
                                <div className='searchDetailWrap'>
                                    <div style={{width: '25%'}}>
                                        <ul tabIndex='0'>
                                            <li style={{textAlign: 'center'}}><strong
                                                onClick={() => cityClick({element: undefined})}>시/도</strong></li>
                                            {                             //요소     //index
                                                Object.keys(areaData).map((element, i) =>
                                                    <li><span style={{textAlign: 'center'}}
                                                              onClick={() => cityClick({element})}>{element}</span></li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                    <div style={{width: '40%', borderLeft: '1px solid #eee', marginBottom: '10px'}}>
                                        <ul tabIndex='0'>
                                            <li><strong onClick={() => districtClick({element: undefined})}>시/군/구</strong></li>
                                            {
                                                cityArea === '시/도' ? '' :
                                                    Object.keys(areaData[cityArea]).map((element, i) =>
                                                        <li><span onClick={() => districtClick({element})}>{element}</span></li>
                                                    )
                                            }
                                        </ul>
                                    </div>
                                    <div style={{width: '35%', borderLeft: '1px solid #eee', marginBottom: '10px'}}>
                                        <ul tabIndex='0'>
                                            <li><strong onClick={() => addressDetailClick({element: undefined})}>읍/면/동</strong></li>
                                            {
                                                districtArea === '시/군/구' ? '' :
                                                    Object.values(areaData[cityArea][districtArea]).map((element, i) =>
                                                        <li><span onClick={() => addressDetailClick({element})}>{element}</span></li>
                                                    )
                                            }
                                        </ul>
                                    </div>
                                    <p className='searchBtn'>
                                        <span onClick={() => addressSearch()}>확인</span>
                                        <span onClick={() => resetSearch()}>취소</span>
                                    </p>
                                </div>
                            </Collapse>
                        </div>
                        <div className={"searchResultWrap " + fade}>
                            <div className='searchText'>
                                <form onSubmit={wordSearch} name='wordSearch'>
                                    <input type="text" placeholder='병원명 또는 약국명 입력' value={word} onChange={saveWord}/>

                                    <button type='submit'><i className="fa-solid fa-magnifying-glass" style={{color: "#fff", fontSize: '14px'}}></i></button>
                                </form>
                            </div>

                            <div className='searchResultCenter'>
                                검색결과 (총 <span>{searchCount}</span> 건)
                                <p>※내 위치와 가까운 병원 또는 약국의 검색결과입니다.</p>
                            </div>

                            <div className='searchResultSuccess'>
                                <ul onScroll={() => unLimitScroll()} ref={listRef}>
                                    {
                                        wordSearchNo ?
                                            <div className='noData'>
                                                데이터가 없습니다.
                                            </div>
                                            : hospitalData.map((element, i) =>
                                                <ResultLi hospitalData={element} key={i} />
                                            )
                                    }
                                </ul>
                            </div>

                            <div className='mapFoot'>
                                {
                                    token ?
                                        <div>
                                            <span style={{fontWeight: "bold"}}>{username}</span>님 환영합니다.
                                            <span style={{float: "right", marginTop :"-5px"}} className='logout' onClick={() => logout()}>로그아웃</span>
                                        </div> :
                                        <div>
                                            <Link to='/login'>로그인</Link>
                                            <Link to='/join'>회원가입</Link>
                                        </div>
                                }
                            </div>
                        </div>

                        <span className={fade === 'hide' ? "searchOpen" : "searchClose"} onClick={() => searchResultClick()}></span>
                    </>
                }/>
                <Route path="/hospitalInfo/:careCode" element={<HospitalInfo />} />

                <Route path="/login" element={<LoginForm />} />

                <Route path="/join" element={<SignupForm />} />

                <Route path='/insertReview/:careCode' element={<InsertReview />} />
            </Routes>
        </>
    )
}

function ResultLi(props){

    // 자식 데이터로 넣어준 hospitalData
    const data = props.hospitalData;

    return (
        <li>
            <span className='hospitalTitle' onClick={() => window.open(`/hospitalInfo/${data.careCode}`, '_blank', 'width=1100, height=900')}>{data.hospitalName}
                <Link to={'http://map.naver.com/index.nhn?elng='+data.x_coordinate+'&elat='+data.y_coordinate+'&etext='+data.hospitalName+'&menu=route&pathType=1'} className='btn-map' target='_blank'>길찾기</Link>
            </span>

            <p className='hospitalSubInfo'>
                <span>{data.hospitalType}</span>
                <span className='bar'></span>
                <span>{data.phoneNumber}</span>

                <span>
                    <i className='icon-home'>주소</i>{data.address}
                </span>
            </p>
        </li>
    )
}

export default App;