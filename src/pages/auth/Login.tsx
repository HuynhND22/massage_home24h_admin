import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Checkbox, Anchor, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconLock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Sử dụng hook useAuth để lấy phương thức login

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
      password: (value) => (value.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // Sử dụng phương thức login từ AuthContext
      // Phương thức này sẽ xử lý cả cấu trúc phản hồi cũ và mới
      // và tự động chuyển hướng sau khi đăng nhập thành công
      const success = await login(values.email, values.password);
      
      if (!success) {
        setLoading(false);
      }
      // Nếu đăng nhập thành công, AuthContext sẽ tự động chuyển hướng
      // và hiển thị thông báo thành công, nên không cần xử lý thêm ở đây
    } catch (error) {
      console.error('Login error:', error);
      notifications.show({
        title: 'Lỗi kết nối',
        message: 'Không thể kết nối đến máy chủ',
        color: 'red',
      });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Text size="lg" fw={500} mb="md">
        Đăng nhập vào tài khoản của bạn
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          leftSection={<IconAt size={16} />}
          required
          mb="md"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Mật khẩu"
          placeholder="Mật khẩu của bạn"
          leftSection={<IconLock size={16} />}
          required
          mb="md"
          {...form.getInputProps('password')}
        />

        <Group justify="space-between" mb="md">
          <Checkbox
            label="Ghi nhớ đăng nhập"
            {...form.getInputProps('rememberMe', { type: 'checkbox' })}
          />
          <Anchor<'a'> size="sm" href="#">
            Quên mật khẩu?
          </Anchor>
        </Group>

        <Button 
          fullWidth 
          type="submit" 
          loading={loading}
          variant="gradient" 
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
        >
          Đăng nhập
        </Button>
      </form>
    </Box>
  );
}
