import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Checkbox, Anchor, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconLock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function Login() {
  const [loading, setLoading] = useState(false);

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
      // Sử dụng axios trực tiếp để gọi API login
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        }),
      });
      
      const data = await response.json();
      console.log('Login API response:', data);
      
      if (data.success) {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.data.token);
        
        // Hiển thị thông báo thành công
        notifications.show({
          title: 'Đăng nhập thành công',
          message: 'Chào mừng bạn quay trở lại!',
          color: 'teal',
          autoClose: 2000,
        });
        
        // Chuyển hướng sang trang chính
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        // Hiển thị thông báo lỗi
        notifications.show({
          title: 'Đăng nhập thất bại',
          message: data.message || 'Đã xảy ra lỗi khi đăng nhập',
          color: 'red',
        });
        setLoading(false);
      }
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
