import { ReactNode } from 'react';
import { 
  Container, 
  Title, 
  Group, 
  Button,
  Paper,
  LoadingOverlay,
  Stack
} from '@mantine/core';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface FormLayoutProps {
  title: string;
  loading: boolean;
  backUrl: string;
  onSubmit: () => void;
  children: ReactNode;
  submitDisabled?: boolean;
}

export function FormLayout({ 
  title, 
  loading, 
  backUrl, 
  onSubmit, 
  children,
  submitDisabled = false
}: FormLayoutProps) {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading} />
      
      <Title order={2} mb="md">{title}</Title>
      
      <Paper shadow="xs" p="md" withBorder>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          <Stack gap="md">
            {children}
            
            <Group mt="xl">
              <Button 
                leftSection={<IconArrowLeft size={16} />}
                variant="default" 
                onClick={() => navigate(backUrl)}
              >
                Quay lại
              </Button>
              
              <Button 
                leftSection={<IconDeviceFloppy size={16} />}
                type="submit"
                disabled={submitDisabled}
              >
                Lưu
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
