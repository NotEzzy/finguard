'use client';

import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  HistoryOutlined, 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined, 
  SafetyOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';

const { Sider } = Layout;

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  // Admin check - could be more sophisticated based on Firebase custom claims
  const isAdmin = user?.email?.endsWith('@admin.com');

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
    >
      <div className="p-4 h-16 flex items-center justify-center">
        <h1 className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>
          FinGuard
        </h1>
        {collapsed && <SafetyOutlined className="text-xl" />}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[pathname || '']}
        items={[
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            key: '/transactions',
            icon: <HistoryOutlined />,
            label: <Link href="/transactions">Transactions</Link>,
          },
          {
            key: '/alerts',
            icon: <BellOutlined />,
            label: <Link href="/alerts">Alerts</Link>,
          },
          {
            key: '/profile',
            icon: <UserOutlined />,
            label: <Link href="/profile">Profile</Link>,
          },
          {
            key: '/settings',
            icon: <SettingOutlined />,
            label: <Link href="/settings">Settings</Link>,
          },
          ...(isAdmin ? [
            {
              key: '/admin',
              icon: <SafetyOutlined />,
              label: <Link href="/admin">Admin</Link>,
            }
          ] : []),
        ]}
      />
    </Sider>
  );
} 