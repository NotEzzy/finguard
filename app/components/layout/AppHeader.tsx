'use client';

import { Layout, Button, Avatar, Dropdown, Space, theme } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  BellOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../lib/store/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

export default function AppHeader() {
  const { token } = theme.useToken();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const items = [
    {
      key: 'profile',
      label: <a href="/profile">Profile</a>,
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: <a href="/settings">Settings</a>,
      icon: <SettingOutlined />,
    },
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'logout',
      label: <a onClick={handleLogout}>Logout</a>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header style={{ 
      background: token.colorBgContainer,
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }}>
      <Space size="large">
        <Button 
          type="text" 
          icon={<BellOutlined />} 
          onClick={() => router.push('/alerts')}
        />
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <a onClick={(e) => e.preventDefault()}>
            <Avatar 
              src={user?.photoURL}
              icon={!user?.photoURL && <UserOutlined />}
            />
          </a>
        </Dropdown>
      </Space>
    </Header>
  );
} 