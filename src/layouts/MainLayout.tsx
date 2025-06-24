import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell,
  Text,
  Burger,
  NavLink,
  Avatar,
  Box,
  Group,
  Menu,
  useMantineTheme,
  Divider,
} from '@mantine/core';
import { useMediaQuery } from '../hooks';
import {
  IconDashboard,
  IconLogout,
  IconUser,
  IconCategory,
  IconArticle,
  IconBrandBooking,
  IconPhoto,
  IconSettings,
} from '@tabler/icons-react';

import { useAuth } from '../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isMobile } = useMediaQuery();

  const navItems = [
    { label: 'Dashboard', icon: <IconDashboard size={16} />, path: '/' },
    { label: 'Danh mục', icon: <IconCategory size={16} />, path: '/categories' },
    { label: 'Bài viết', icon: <IconArticle size={16} />, path: '/blogs' },
    { label: 'Dịch vụ', icon: <IconBrandBooking size={16} />, path: '/services' },
    { label: 'Banner', icon: <IconPhoto size={16} />, path: '/slides' },
    { label: 'Cài đặt website', icon: <IconSettings size={16} />, path: '/web-settings' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
          {isMobile && (
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          )}

          <Text fw={700} size="lg" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
            Spa Renew Admin
          </Text>

          <Group>
            <Menu position="bottom-end">
              <Menu.Target>
                <Group gap="xs" style={{ cursor: 'pointer' }}>
                  <Avatar color="teal" radius="xl">
                    {user?.name?.charAt(0) || 'A'}
                  </Avatar>
                  {!isMobile && (
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {user?.name || 'Admin'}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {user?.email || 'admin@example.com'}
                      </Text>
                    </Box>
                  )}
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={14} />}>Hồ sơ</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={logout}>
                  Đăng xuất
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              leftSection={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setOpened(false);
              }}
              style={{ borderRadius: theme.radius.sm }}
              styles={(_theme) => ({
                root: {
                  fontWeight: 500,
                  marginBottom: 5,
                },
              })}
            />
          ))}
        </AppShell.Section>

        <AppShell.Section>
          <Divider my="sm" />
          <NavLink
            label="Đăng xuất"
            leftSection={<IconUser size={16} />}
            onClick={logout}
            style={{ borderRadius: theme.radius.sm }}
            color="red"
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main style={{ background: theme.colors.gray[0] }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
