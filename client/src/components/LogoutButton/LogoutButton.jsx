import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const LogoutButton = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_API_URL;

  async function handleLogOut() {
  await fetch(`${apiUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  navigate('/login')
  }

  return (
    <div>
      <Button type="default" onClick={handleLogOut} style={{color: 'red'}}>
        <LogoutOutlined/> Logout
      </Button>
    </div>
  )
}

export default LogoutButton
