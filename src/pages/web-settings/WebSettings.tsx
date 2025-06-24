import { Container, Title } from '@mantine/core';
import { WebSettingsForm } from './WebSettingsForm';

export default function WebSettings() {
  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="lg" ta="center">Cài đặt website</Title>
      <WebSettingsForm />
    </Container>
  );
} 