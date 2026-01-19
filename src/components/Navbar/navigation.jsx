// src/navigation.js
import { BugOutlined, HomeOutlined, PieChartOutlined, UserOutlined } from '@ant-design/icons';

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
  // Add more items as needed
];