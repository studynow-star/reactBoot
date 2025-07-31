import React from "react";
import {Link} from "react-router-dom";

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

export default ResultLi;