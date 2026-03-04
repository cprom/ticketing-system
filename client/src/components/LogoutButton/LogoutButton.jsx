import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons';

const LogoutButton = () => {

   async function handleLogOut() {
  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  window.location.reload();
  }

  return (
    <div>
      <Button type="text" onClick={handleLogOut} style={{color: 'red'}}>
        <LogoutOutlined/> Logout
      </Button>
    </div>
  )
}

export default LogoutButton
