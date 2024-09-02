import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8089/auth/logout')
      .then(res => {
        if (res.data.status) {
          navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Home</h1>
      <Link to="/dashboard">Dashboard</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
