import { Container, Title, Text, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container size="md" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center' 
    }}>
      <Title
        fw={900}
        fz={80}
        c="blue"
      >
        404
      </Title>
      <Text color="dimmed" size="lg" fw={500} mb={5} mt="xs">
        Không tìm thấy trang bạn yêu cầu
      </Text>
      <Text c="dimmed" size="md" ta="center" mb={30}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        Vui lòng kiểm tra lại URL hoặc quay lại trang chủ.
      </Text>
      <Group justify="center">
        <Button 
          variant="gradient" 
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
          size="md"
          onClick={() => navigate('/')}
        >
          Quay lại trang chủ
        </Button>
      </Group>
    </Container>
  );
}
