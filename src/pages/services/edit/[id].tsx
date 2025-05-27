import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Title, LoadingOverlay } from '@mantine/core';
import { serviceService } from '../../../services/service.service';
import { showSuccessNotification, showErrorNotification } from '../../../utils/notificationUtils';
import { handleApiError, isValidId } from '../../../utils/errorHandling';
import ServiceForm, { ServiceFormValues } from '../../../components/services/ServiceForm';

export default function EditService() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<ServiceFormValues>>({});
  const navigate = useNavigate();
  
  // Tải dữ liệu dịch vụ
  useEffect(() => {
    const fetchService = async () => {
      // Kiểm tra ID có hợp lệ không
      if (!id || !isValidId(id)) {
        showErrorNotification('Lỗi', 'ID dịch vụ không hợp lệ');
        navigate('/services');
        return;
      }
      
      try {
        setLoading(true);
        const response = await serviceService.getServiceById(parseInt(id));
        const service = response.data.data;
        
        // Tạo đối tượng translations với tất cả các ngôn ngữ
        const translations = {
          vi: { language: 'vi', name: '', description: '' },
          zh: { language: 'zh', name: '', description: '' },
          ko: { language: 'ko', name: '', description: '' },
          ru: { language: 'ru', name: '', description: '' },
        };
        
        // Cập nhật dữ liệu từ API vào đối tượng translations
        service.translations.forEach((translation: any) => {
          if (translation.language in translations) {
            translations[translation.language as keyof typeof translations] = {
              language: translation.language,
              name: translation.name,
              description: translation.description,
            };
          }
        });
        
        // Cập nhật giá trị ban đầu cho form
        setInitialValues({
          name: service.name,
          slug: service.slug,
          description: service.description,
          price: service.price,
          duration: service.duration,
          isActive: service.isActive,
          currentImageUrl: service.image,
          translations,
        });
      } catch (error) {
        handleApiError(error, 'Không thể tải thông tin dịch vụ');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [id, navigate]);
  
  // Xử lý khi submit form
  const handleSubmit = async (formData: FormData) => {
    if (!id || !isValidId(id)) {
      showErrorNotification('Lỗi', 'ID dịch vụ không hợp lệ');
      return;
    }
    
    try {
      setSubmitting(true);
      await serviceService.updateService(parseInt(id), formData);
      showSuccessNotification('Cập nhật', 'Đã cập nhật dịch vụ thành công');
      navigate('/services');
    } catch (error) {
      handleApiError(error, 'Không thể cập nhật dịch vụ');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container size="xl" style={{ position: 'relative', minHeight: '200px' }}>
        <LoadingOverlay visible={true} />
      </Container>
    );
  }
  
  return (
    <Container size="xl">
      <Title order={2} mb="md">Chỉnh sửa dịch vụ</Title>
      <ServiceForm 
        initialValues={initialValues}
        loading={submitting}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
