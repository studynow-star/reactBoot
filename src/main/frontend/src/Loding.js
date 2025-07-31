// Loading.js
import React from 'react';
import {Background} from './Styles';
import Spinner from './img/spinner.gif';

export default () => {
    return (
        <Background>
            <img src={Spinner} alt="로딩중" width="20%" />
        </Background>
    );
};