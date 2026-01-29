// src/navigation.js
import { BugOutlined, HomeOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

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