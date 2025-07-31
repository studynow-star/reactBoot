import React, {useState} from "react";
import {loginRequest} from "../BackRequest";
import './login.css'
import {Link} from "react-router-dom";

function LoginForm() {
    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const onNaverLogin = () => window.location.href = "http://localhost:8080/oauth2/authorization/naver";

    const onGoogleLogin = () => window.location.href = "http://localhost:8080/oauth2/authorization/google";

    const onKakaoLogin = () => window.location.href = "http://localhost:8080/oauth2/authorization/kakao";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("모든 필드를 입력해야 합니다.");
            return;
        }

        try {
            const data = await loginRequest('/login', {
                username: username,
                password: password
            });

            // 액세스 토큰 저장
            localStorage.setItem('accessToken', data.headers.get('Authorization'));

            localStorage.setItem("username", username);

            // 이후 다른 페이지로 리디렉션 또는 추가 작업
            console.log("로그인 성공:", data.headers.get('Authorization'), localStorage.getItem('username'));

            window.location.href = '/';

        } catch (error) {
            console.error('로그인 실패:', error);
            // setError("로그인에 실패했습니다. 사용자 이름이나 비밀번호를 확인하세요.");
            alert('아이디 혹은 비밀번호가 틀립니다.\n다시 입력해주세요')
        }
    };

    return (
        // <div style={formStyle}>
        //     <h2>로그인</h2>
        //     {error && <p style={errorStyle}>{error}</p>}
        //     <form onSubmit={handleSubmit}>
        //         <div style={inputContainerStyle}>
        //             <label htmlFor="username" style={labelStyle}>사용자 이름</label>
        //             <input
        //                 type="text"
        //                 id="username"
        //                 value={username}
        //                 onChange={(e) => setUsername(e.target.value)}
        //                 style={inputStyle}
        //             />
        //         </div>
        //         <div style={inputContainerStyle}>
        //             <label htmlFor="password" style={labelStyle}>비밀번호</label>
        //             <input
        //                 type="password"
        //                 id="password"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 style={inputStyle}
        //             />
        //         </div>ㄷ
        //         <button onClick={onNaverLogin} style={naverButtonStyle}>NAVER LOGIN</button>
        //         <button onClick={onGoogleLogin} style={googleButtonStyle}>GOOGLE LOGIN</button>
        //         <button onClick={onKakaoLogin} style={kakaoButtonStyle}>KAKAO LOGIN</button>
        //         <button type="submit" style={buttonStyle}>로그인</button>
        //     </form>
        // </div>
        <>
            <Link to='/' className='mapBack'>지도</Link>

            <form onSubmit={handleSubmit}>
                <div className='loginForm'>
                    <h1>로그인</h1>

                    {error && <p style={errorStyle}>{error}</p>}

                    <div className='loginForm_page'>
                        <div className='loginForm_input'>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <label htmlFor="username">아이디</label>
                        </div>

                        <div className='loginForm_input' style={{marginBottom : '10px'}}>
                            <input type="password" id='password' onChange={(e) => setPassword(e.target.value)}/>
                            <label htmlFor="password">비밀번호</label>
                        </div>

                        <Link to='/join' className='signUpAndLogin'>회원가입</Link>

                        <button type='submit' className='submitBtn'>로그인</button>
                    </div>

                    <div className='socialLine'>
                        소셜 로그인
                    </div>

                    <div className='socialLoginBox'>
                        <button onClick={onGoogleLogin} className='googleBtn socialBtn'>
                        </button>
                        <button onClick={onKakaoLogin} className='kakaoBtn socialBtn'>
                        </button>
                        <button onClick={onNaverLogin} className='naverBtn socialBtn'>
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}


const errorStyle = {
    color: "red",
};



export default LoginForm;
