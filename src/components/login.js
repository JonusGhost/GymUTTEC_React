import React from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Layout, Form, Input, Button, Card, theme } from 'antd';

const { Content } = Layout;

const Login = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onFinish = (values) => {
    console.log('Received values:', values);
    // Here you'll handle login logic
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: colorBgContainer 
      }}>
        <Card 
          title="GymUTTEC Login" 
          style={{ 
            width: 400,
            borderRadius: borderRadiusLG,
          }}
        >
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                size="large"
              />
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
              <Button type="primary" htmlType="submit" block size="large">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        GymUTTEC ©{new Date().getFullYear()} Created by Wisdom Technologies
      </Layout.Footer>
    </Layout>
  );
};

export default Login;