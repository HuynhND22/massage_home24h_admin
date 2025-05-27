import { Paper, Box, Text } from '@mantine/core';
import { useMediaQuery } from '../hooks';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isMobile } = useMediaQuery();
  
  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #20c997 0%, #339af0 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        p={30}
        shadow="md"
        radius="md"
        style={{
          width: isMobile ? '100%' : '400px',
        }}
      >
        <Box mb={20} style={{ textAlign: 'center' }}>
          <Text 
            size="xl" 
            fw={700} 
            variant="gradient" 
            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
          >
            Spa Renew Admin
          </Text>
        </Box>
        {children}
      </Paper>
    </Box>
  );
}
