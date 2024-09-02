import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.post('http://localhost:8089/auth/verify', {}, { withCredentials: true });
                if (response.data.status) {
                    // Token is valid; you can display the dashboard content here
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Verification Error:', error);
                navigate('/login');
            }
        };

        verifyToken();
    }, [navigate]);

    return (
        <div>
            Dashboard
        </div>
    );
};

export default Dashboard;
