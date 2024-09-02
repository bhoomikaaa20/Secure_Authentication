import { useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const { token } = useParams(); // Correctly destructure token from useParams
    const navigate = useNavigate(); // Use useNavigate hook

    function handleSubmit(e) {
        e.preventDefault();
        axios.post(`http://localhost:8089/auth/resetPassword/${token}`, { password }) // Append token correctly to URL
            .then(res => {
                if (res.data.status) {
                    navigate('/login'); // Use navigate to redirect to login page
                }
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <form className="ResetPassword" onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <input type='password' placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button>Send</button>
                
                <p>Do not have an Account?</p>
                <a href="/signup">Signup</a>
            </form>
        </>
    );
}
