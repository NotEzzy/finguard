'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { Button, Form, Input, Card, Typography, Divider, message } from 'antd';
import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      message.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Title level={2}>Sign in to FinGuard</Title>
          <Text type="secondary">Monitor and protect your transactions</Text>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Or</Divider>

        <Button 
          icon={<GoogleOutlined />} 
          size="large" 
          block 
          onClick={handleGoogleSignIn}
          loading={loading}
        >
          Continue with Google
        </Button>

        <div className="mt-4 text-center">
          <Text type="secondary">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
} 