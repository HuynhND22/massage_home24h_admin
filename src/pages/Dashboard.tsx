import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SimpleGrid,
  Paper,
  Text,
  Group,
  ThemeIcon,
  Title,
  Container,
  RingProgress,
  Center,
  Stack,
  Divider,
  Loader,
} from '@mantine/core';
import { 
  IconMassage, 
  IconNote, 
  IconMessage, 
  IconEye,
} from '@tabler/icons-react';

import { serviceService } from '../services/service.service';
import { blogService } from '../services/blog.service';
import { contactService } from '../services/contact.service';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function StatsCard({ title, value, description, icon, onClick }: StatsCardProps) {
  return (
    <Paper 
      p="md" 
      shadow="xs" 
      radius="md"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Group justify="space-between">
        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        </div>
        <ThemeIcon 
          color="teal" 
          variant="light" 
          size={50} 
          radius="xl"
        >
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    services: 0,
    posts: 0,
    unreadMessages: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [servicesRes, postsRes, contactsRes] = await Promise.all([
          serviceService.getAllServices(),
          blogService.getAllPosts(1, 10, undefined, false),
          contactService.getAllContacts(1, 100)
        ]);
        
        const services = servicesRes.data.data;
        const posts = postsRes.data.data.posts;
        const contacts = contactsRes.data.data.contacts;
        
        // Calculate unread messages
        const unreadMessages = contacts.filter((contact: any) => !contact.isRead).length;
        
        setStats({
          services: services.length,
          posts: posts.length,
          unreadMessages: unreadMessages,
          totalMessages: contacts.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <Center style={{ height: '80vh' }}>
        <Loader size="lg" variant="dots" />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="md">Dashboard</Title>
      
      <SimpleGrid cols={{ base: 1, xs: 1, sm: 2, md: 2, lg: 4 }} mb="xl">
        <StatsCard
          title="Dịch vụ"
          value={stats.services}
          description="Tổng số dịch vụ"
          icon={<IconMassage size={30} stroke={1.5} />}
          onClick={() => navigate('/services')}
        />
        <StatsCard
          title="Bài viết"
          value={stats.posts}
          description="Tổng số bài viết blog"
          icon={<IconNote size={30} stroke={1.5} />}
          onClick={() => navigate('/blog')}
        />
        <StatsCard
          title="Tin nhắn chưa đọc"
          value={stats.unreadMessages}
          description={`Trên tổng số ${stats.totalMessages} tin nhắn`}
          icon={<IconMessage size={30} stroke={1.5} />}
          onClick={() => navigate('/messages')}
        />
        <StatsCard
          title="Truy cập"
          value="1,254"
          description="Lượt truy cập trong tháng"
          icon={<IconEye size={30} stroke={1.5} />}
        />
      </SimpleGrid>
      
      <Divider my="xl" />
      
      <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2 }}>
        <Paper p="md" shadow="xs" radius="md">
          <Title order={3} size="h4" mb="md">Tình trạng tin nhắn</Title>
          <Group justify="center">
            <RingProgress
              size={180}
              thickness={16}
              sections={[
                { value: (stats.unreadMessages / Math.max(stats.totalMessages, 1)) * 100, color: 'teal' },
              ]}
              label={
                <Center>
                  <Stack gap={0} align="center">
                    <Text size="xl" fw={700}>{stats.unreadMessages}</Text>
                    <Text size="xs" c="dimmed">Chưa đọc</Text>
                  </Stack>
                </Center>
              }
            />
          </Group>
        </Paper>
        
        <Paper p="md" shadow="xs" radius="md">
          <Title order={3} size="h4" mb="md">Bài viết gần đây</Title>
          {/* Placeholder for recent posts list */}
          <Text c="dimmed" ta="center" mt={30}>
            Đang tải dữ liệu bài viết...
          </Text>
        </Paper>
      </SimpleGrid>
    </Container>
  );
}
