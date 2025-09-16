import React, { useState } from 'react';
import {
  Card,
  List,
  Button,
  Badge,
  Typography,
  Space,
  Alert,
  Modal,
  Descriptions,
  Tag,
  Empty,
  Tooltip,
  Spin,
  notification,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  UsbOutlined,
  ReloadOutlined,
  PlusOutlined,
  LinkOutlined,
  DisconnectOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useUSB, type USBDeviceInfo } from '../hooks/useUSB';
import type { USBDevice } from '../types/usb';

const { Title, Text, Paragraph } = Typography;

interface USBManagerProps {
  onDeviceSelect?: (device: USBDevice) => void;
}

const USBManager: React.FC<USBManagerProps> = ({ onDeviceSelect }) => {
  const {
    isSupported,
    devices,
    isScanning,
    error,
    requestDevice,
    refreshDevices,
    connectDevice,
    disconnectDevice,
    clearError,
  } = useUSB();

  const [selectedDevice, setSelectedDevice] = useState<USBDeviceInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  // 请求访问新设备
  const handleRequestDevice = async () => {
    try {
      const device = await requestDevice({
        filters: [] // 显示所有设备，也可以添加过滤器
      });
      
      if (device) {
        notification.success({
          message: '设备访问已授权',
          description: `成功获取设备访问权限：${device.productName || '未知设备'}`,
          placement: 'topRight',
        });
        
        onDeviceSelect?.(device);
      }
    } catch (err: any) {
      notification.error({
        message: '请求设备失败',
        description: err.message || '未知错误',
        placement: 'topRight',
      });
    }
  };

  // 连接设备
  const handleConnectDevice = async (deviceInfo: USBDeviceInfo) => {
    setIsConnecting(deviceInfo.id);
    try {
      const success = await connectDevice(deviceInfo.device);
      if (success) {
        notification.success({
          message: '设备连接成功',
          description: `已连接到设备：${deviceInfo.name}`,
          placement: 'topRight',
        });
        
        onDeviceSelect?.(deviceInfo.device);
      }
    } catch (err: any) {
      notification.error({
        message: '设备连接失败',
        description: err.message || '未知错误',
        placement: 'topRight',
      });
    } finally {
      setIsConnecting(null);
    }
  };

  // 断开设备连接
  const handleDisconnectDevice = async (deviceInfo: USBDeviceInfo) => {
    setIsConnecting(deviceInfo.id);
    try {
      const success = await disconnectDevice(deviceInfo.device);
      if (success) {
        notification.success({
          message: '设备已断开连接',
          description: `已断开设备：${deviceInfo.name}`,
          placement: 'topRight',
        });
      }
    } catch (err: any) {
      notification.error({
        message: '断开连接失败',
        description: err.message || '未知错误',
        placement: 'topRight',
      });
    } finally {
      setIsConnecting(null);
    }
  };

  // 显示设备详细信息
  const showDeviceDetails = (deviceInfo: USBDeviceInfo) => {
    setSelectedDevice(deviceInfo);
    setIsModalVisible(true);
  };

  // 格式化设备ID
  const formatDeviceId = (vendorId: number, productId: number) => {
    return `${vendorId.toString(16).toUpperCase().padStart(4, '0')}:${productId.toString(16).toUpperCase().padStart(4, '0')}`;
  };

  // 获取设备状态标签
  const getDeviceStatusBadge = (deviceInfo: USBDeviceInfo) => {
    if (deviceInfo.connected) {
      return (
        <Badge 
          status="success" 
          text={
            <Text type="success">
              <CheckCircleOutlined /> 已连接
            </Text>
          } 
        />
      );
    } else {
      return (
        <Badge 
          status="default" 
          text={
            <Text type="secondary">
              <CloseCircleOutlined /> 未连接
            </Text>
          } 
        />
      );
    }
  };

  // 渲染设备列表项
  const renderDeviceItem = (deviceInfo: USBDeviceInfo) => {
    const isCurrentlyConnecting = isConnecting === deviceInfo.id;

    return (
      <List.Item
        key={deviceInfo.id}
        actions={[
          <Tooltip title="查看详细信息">
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              onClick={() => showDeviceDetails(deviceInfo)}
            />
          </Tooltip>,
          deviceInfo.connected ? (
            <Tooltip title="断开连接">
              <Button
                type="text"
                danger
                icon={<DisconnectOutlined />}
                loading={isCurrentlyConnecting}
                onClick={() => handleDisconnectDevice(deviceInfo)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="连接设备">
              <Button
                type="text"
                icon={<LinkOutlined />}
                loading={isCurrentlyConnecting}
                onClick={() => handleConnectDevice(deviceInfo)}
              />
            </Tooltip>
          ),
        ]}
      >
        <List.Item.Meta
          avatar={
            <Badge dot={deviceInfo.connected} color="green">
              <UsbOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            </Badge>
          }
          title={
            <Space>
              <Text strong>{deviceInfo.name}</Text>
              <Tag color="blue">
                {formatDeviceId(deviceInfo.vendorId, deviceInfo.productId)}
              </Tag>
            </Space>
          }
          description={
            <Space direction="vertical" size={2}>
              <Text type="secondary">
                {deviceInfo.manufacturerName || '未知制造商'}
              </Text>
              {getDeviceStatusBadge(deviceInfo)}
              <Text type="secondary" style={{ fontSize: 12 }}>
                最后连接: {deviceInfo.lastConnected.toLocaleString()}
              </Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  if (!isSupported) {
    return (
      <Card>
        <Alert
          message="浏览器不支持 WebUSB API"
          description={
            <div>
              <Paragraph>
                您的浏览器不支持 WebUSB API，无法检测和管理 USB 设备。
              </Paragraph>
              <Paragraph>
                请使用支持 WebUSB 的现代浏览器：
              </Paragraph>
              <ul>
                <li>Google Chrome 61+ (推荐)</li>
                <li>Microsoft Edge 79+</li>
                <li>Opera 48+</li>
              </ul>
              <Paragraph type="secondary">
                注意：Firefox 和 Safari 目前不支持 WebUSB API。
              </Paragraph>
            </div>
          }
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <UsbOutlined />
                <Title level={4} style={{ margin: 0 }}>
                  USB 设备管理器
                </Title>
              </Space>
            }
            extra={
              <Space>
                <Tooltip title="刷新设备列表">
                  <Button
                    icon={<ReloadOutlined />}
                    loading={isScanning}
                    onClick={refreshDevices}
                  />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleRequestDevice}
                >
                  添加设备
                </Button>
              </Space>
            }
          >
            {error && (
              <Alert
                message="错误"
                description={error}
                type="error"
                showIcon
                closable
                onClose={clearError}
                style={{ marginBottom: 16 }}
              />
            )}

            <Spin spinning={isScanning} tip="正在扫描设备...">
              {devices.length > 0 ? (
                <List
                  dataSource={devices}
                  renderItem={renderDeviceItem}
                  pagination={devices.length > 5 ? { pageSize: 5 } : false}
                />
              ) : (
                <Empty
                  image={<UsbOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                  description={
                    <Space direction="vertical">
                      <Text type="secondary">暂无 USB 设备</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        点击"添加设备"按钮来请求访问 USB 设备
                      </Text>
                    </Space>
                  }
                />
              )}
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* 设备详细信息模态框 */}
      <Modal
        title={
          <Space>
            <UsbOutlined />
            设备详细信息
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedDevice && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="设备名称">
              <Space>
                {selectedDevice.name}
                {getDeviceStatusBadge(selectedDevice)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="制造商">
              {selectedDevice.manufacturerName || '未知制造商'}
            </Descriptions.Item>
            <Descriptions.Item label="产品名称">
              {selectedDevice.productName || '未知产品'}
            </Descriptions.Item>
            <Descriptions.Item label="供应商ID">
              <Tag color="blue">
                0x{selectedDevice.vendorId.toString(16).toUpperCase().padStart(4, '0')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="产品ID">
              <Tag color="green">
                0x{selectedDevice.productId.toString(16).toUpperCase().padStart(4, '0')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="序列号">
              {selectedDevice.serialNumber || '无序列号'}
            </Descriptions.Item>
            <Descriptions.Item label="设备ID">
              <Tag>{formatDeviceId(selectedDevice.vendorId, selectedDevice.productId)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="最后连接时间">
              {selectedDevice.lastConnected.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="连接状态">
              {selectedDevice.connected ? (
                <Tag color="success">
                  <CheckCircleOutlined /> 已连接
                </Tag>
              ) : (
                <Tag color="default">
                  <CloseCircleOutlined /> 未连接
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default USBManager;
