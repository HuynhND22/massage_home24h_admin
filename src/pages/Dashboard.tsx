import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SimpleGrid,
  Paper,
  Text,
  Title,
  Group,
  Stack,
  Divider,
  LoadingOverlay,
  Avatar,
  ThemeIcon,
  RingProgress,
  Center,
  Container,
  Loader
} from '@mantine/core';
import {
  IconMassage,
  IconMessage,
  IconNote
} from '@tabler/icons-react';

import { serviceService } from '../services/service.service';
import { blogService } from '../services/blog.service';
import { contactService } from '../services/contact.service';
import { reviewService } from '../services/review.service';

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
      radius="md"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Group justify="center">
        <Loader size="xl" />
      </Group>
      <Group justify="space-between" align="center">
        <div>
          <Text size="xs">
            {title}
          </Text>
          <Text size="xl">
            {value}
          </Text>
          <Text color="dimmed" size="sm">
            {description}
          </Text>
        </div>
        <ThemeIcon size={40} radius="md" color="blue">
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
    totalServices: 0,
    totalPosts: 0,
    totalMessages: 0,
    totalReviews: 0,
    totalViews: 0,
    unreadMessages: 0
  });
  const [postsResponse, setPostsResponse] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Lấy số lượng dịch vụ
        const servicesResponse = await serviceService.getAllServices(1, 100);
        const totalServices = servicesResponse.data?.length || 0;

        // Lấy số lượng bài viết
        const postsResponse = await blogService.getAllPosts(1, 100);
        const totalPosts = postsResponse.data?.length || 0;
        setPostsResponse(postsResponse);

        // Lấy số lượng tin nhắn
        const messagesResponse = await contactService.getAllMessages(1, 100);
        const totalMessages = messagesResponse.data?.length || 0;
        const unreadMessages = messagesResponse.data?.filter((m: any) => !m.is_read)?.length || 0;

        // Lấy số lượng đánh giá
        const reviewsResponse = await reviewService.getAllReviews(1, 100);
        const totalReviews = reviewsResponse.data?.length || 0;

        setStats({
          totalServices,
          totalPosts,
          totalMessages,
          totalReviews,
          totalViews: 0,
          unreadMessages
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
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
          value={stats.totalServices}
          description="Tổng số dịch vụ"
          icon={<IconMassage size={30} stroke={1.5} />}
          onClick={() => navigate('/services')}
        />
        <StatsCard
          title="Bài viết"
          value={stats.totalPosts}
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
          title="Đánh giá"
          value={stats.totalReviews}
          description="Tổng số đánh giá"
          icon={<IconNote size={30} stroke={1.5} />}
          onClick={() => navigate('/reviews')}
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
                  <Stack align="center">
                    <Text size="xl" fw={700}>{stats.unreadMessages}</Text>
                    <Text size="xs" c="dimmed">Chưa đọc</Text>
                  </Stack>
                </Center>
              }
            />
          </Group>
        </Paper>
        
        <Paper p="md" shadow="xs" radius="md">
          <Stack gap="md">
            <Title order={3} size="h4" mb="md">Bài viết gần đây</Title>
            {loading ? (
              <LoadingOverlay visible={true} />
            ) : (
              postsResponse?.data?.slice(0, 3).map((post: any) => (
                <Paper key={post.id} p="md" shadow="xs" radius="md">
                  <Group gap="md">
                    <Avatar size={40} radius="xl" src={post.author.avatar} />
                    <div>
                      <Text size="sm" fw={500}>
                        {post.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {new Date(post.created_at).toLocaleDateString()}
                      </Text>
                    </div>
                  </Group>
                </Paper>
              ))
            )}
          </Stack>
        </Paper>
      </SimpleGrid>
    </Container>
  );
}
