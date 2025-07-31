import React, {useState} from "react";
import {Link} from "react-router-dom";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword) {
            alert("모든 필드를 입력해야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                console.log("ok");
                const result = await response.text(); // 백엔드에서 "ok"를 받을 것으로 예상
                console.log("서버 응답:", result);
                alert('회원가입이 완료되었습니다.')
                window.location.href = '/';
            } else {
                console.log("로그인 실패: 서버 오류가 발생했습니다.");
            }
        } catch (error) {
            console.log("로그인 실패: 네트워크 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <Link to='/' className='mapBack'>지도</Link>

            <form onSubmit={handleSubmit}>
                <div className='loginForm'>
                    <h1>회원가입</h1>

                    <div className='loginForm_page'>
                        <div className='loginForm_input'>
                            <input type="text" id='id' onChange={(e) => setUsername(e.target.value)}/>
                            <label htmlFor="id">아이디</label>
                        </div>

                        <div className='loginForm_input'>
                            <input type="password" id='password' onChange={(e) => setPassword(e.target.value)}/>
                            <label htmlFor="password">비밀번호</label>
                        </div>

                        <div className='loginForm_input' style={{marginBottom: '10px'}}>
                            <input type="password" id='confirmPassword' onChange={(e) => setConfirmPassword(e.target.value)}/>
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                        </div>

                        <Link to='/login' className='signUpAndLogin'>로그인</Link>

                        <button type='submit' className='submitBtn'>회원가입</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default LoginForm;