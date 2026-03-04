import React from 'react'
import {Button} from 'antd'

const Dashboard = () => {

  async function handleLogOut() {
  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  window.location.reload();
  }

  return (
    <div>
      Dashboard
      <Button onClick={handleLogOut}>Logout</Button>
    </div>
  )
}

export default Dashboard

