import React, { useState } from 'react';
import { ConfigProvider, Layout, theme, Typography, Space, Card, Row, Col } from 'antd';
import { UsbOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import USBManager from './components/USBManager';
import type { USBDevice } from './types/usb';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<USBDevice | null>(null);

  const handleDeviceSelect = (device: USBDevice) => {
    setSelectedDevice(device);
    console.log('选中设备:', device);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Header
          style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <Space>
              <UsbOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                MC Web USB Manager
              </Title>
            </Space>
            
            {selectedDevice && (
              <Space>
                <Text type="secondary">当前设备:</Text>
                <Text strong>{selectedDevice.productName || '未知设备'}</Text>
              </Space>
            )}
          </div>
        </Header>
        
        <Content style={{ padding: '24px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <USBManager onDeviceSelect={handleDeviceSelect} />
            </Col>
            
            {selectedDevice && (
              <Col xs={24}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Card>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <FileTextOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                        <Title level={4}>文件传输</Title>
                        <Text type="secondary">
                          与选中的 USB 设备进行文件传输操作
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Card>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <SettingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                        <Title level={4}>设备配置</Title>
                        <Text type="secondary">
                          查看和修改设备配置参数
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Card>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <UsbOutlined style={{ fontSize: 32, color: '#faad14' }} />
                        <Title level={4}>设备信息</Title>
                        <Text type="secondary">
                          查看详细的设备硬件信息
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Content>
        
        <Footer style={{ textAlign: 'center', background: '#fff' }}>
          <Space split={<Text type="secondary">|</Text>}>
            <Text type="secondary">MC Web USB Manager ©2024</Text>
            <Text type="secondary">基于 WebUSB API</Text>
            <Text type="secondary">React 18 & Ant Design 5</Text>
          </Space>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
