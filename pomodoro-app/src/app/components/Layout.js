'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout as AntLayout, Menu, Typography, ConfigProvider, theme } from 'antd';
import { ClockCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;

export default function Layout({ children }) {
  const pathname = usePathname();
  const { theme: currentTheme, toggleTheme } = useTheme();
  
  // Menu items
  const items = [
    {
      key: '/',
      icon: <ClockCircleOutlined />,
      label: <Link href="/">Timer</Link>,
    },
    {
      key: '/stats',
      icon: <BarChartOutlined />,
      label: <Link href="/stats">Stats</Link>,
    }
  ];

  // Selected key based on current pathname
  const selectedKey = pathname === '/' ? '/' : '/stats';

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' 
          ? theme.darkAlgorithm 
          : theme.defaultAlgorithm,
      }}
    >
      <AntLayout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#fff' }}>
              FocusFlow
            </Title>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={items}
              style={{ marginLeft: 30, flex: 1, minWidth: 0 }}
            />
          </div>
        </Header>
        <Content style={{ padding: '24px 50px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          FocusFlow ©{new Date().getFullYear()} - A minimal pomodoro timer app
        </Footer>
      </AntLayout>
    </ConfigProvider>
  );
}