import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8089/auth/login', { email, password })
            .then(res => {
                if (res.data.status) {
                    navigate('/home');
                } else {
                    setError('Login failed. Please try again.');
                }
            })
            .catch(err => {
                console.log(err);
                setError('An error occurred. Please try again.');
            });
    };

    return (
        <>
            <form className="login" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input
                    type='email'
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type='submit'>Login</button>
                {error && <p className="error">{error}</p>}
                <Link to="/forgotPassword">Forgot Password?</Link>
                <p>Do not have an account?</p>
                <Link to="/signup">Signup</Link>
            </form>
        </>
    );
}
