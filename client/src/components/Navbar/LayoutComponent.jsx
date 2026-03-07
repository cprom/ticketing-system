// src/components/LayoutComponent.js
import React, { useState } from 'react';
import { Image, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { navItems, navItems2 } from './navigation';
import { RocketFilled } from '@ant-design/icons';
import LogoutButton from '../LogoutButton/LogoutButton';

const { Header, Content, Sider } = Layout;

const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Determine the selected key based on the current location pathname
  const selectedKey = navItems.find(item => item.path === location.pathname)?.key;

  return (
    <Layout style={{ minHeight: '98vh'}}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '87vh'}}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // Keep the current menu item highlighted
          onClick={({ key }) => {
            const item = navItems.find(i => i.key === key);
            if (item) {
              navigate(item.path); // Navigate using React Router
            }
          }}
          items={navItems}
        />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // Keep the current menu item highlighted
          onClick={({ key }) => {
            const item = navItems.find(i => i.key === key);
            if (item) {
              navigate(item.path); // Navigate using React Router
            }
          }}
          items={navItems2}
          />
          </div>
        </div>
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          {/* Outlet renders the child routes */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;