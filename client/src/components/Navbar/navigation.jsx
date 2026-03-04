// src/navigation.js
import { BugOutlined, HomeOutlined, LogoutOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

   async function handleLogOut() {
    await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include",
    });
    window.location.reload();
  }

export const navItems = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: '2',
    icon: <BugOutlined />,
    label: 'Tickets',
    path: '/tickets',
  },
  {
    key: '3',
    icon: <UserOutlined />,
    label: 'Profile',
    path: '/profile',
  },
  {
    key: '4',
    icon: <TeamOutlined/>,
    label: 'Users',
    path: '/users',
  }

  // Add more items as needed
];


export const navItems2 = [
   {
    key: '5',
    icon: <LogoutOutlined/>,
    label: 'Log Out',
    onClick: handleLogOut
  }
];