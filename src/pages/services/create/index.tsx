import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title } from '@mantine/core';
import { serviceService } from '../../../services/service.service';
import { showSuccessNotification } from '../../../utils/notificationUtils';
import { handleApiError } from '../../../utils/errorHandling';
import ServiceForm from '../../../components/services/ServiceForm';

export default function CreateService() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await serviceService.createService(formData);
      showSuccessNotification('Dịch vụ mới', 'Đã tạo dịch vụ mới thành công');
      navigate('/services');
    } catch (error) {
      handleApiError(error, 'Không thể tạo dịch vụ mới');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container size="xl">
      <Title order={2} mb="md">Tạo dịch vụ mới</Title>
      <ServiceForm 
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
