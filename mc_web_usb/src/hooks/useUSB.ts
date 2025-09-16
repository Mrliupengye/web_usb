import { useState, useEffect, useCallback, useRef } from 'react';
import type { USBDevice, USBDeviceRequestOptions, USBConnectionEvent } from '../types/usb';

// USB设备状态接口
export interface USBDeviceInfo {
  device: USBDevice;
  id: string;
  name: string;
  vendorId: number;
  productId: number;
  manufacturerName?: string;
  productName?: string;
  serialNumber?: string;
  connected: boolean;
  lastConnected: Date;
}

// Hook返回值类型
export interface UseUSBReturn {
  // 状态
  isSupported: boolean;
  devices: USBDeviceInfo[];
  isScanning: boolean;
  error: string | null;
  
  // 方法
  requestDevice: (options?: USBDeviceRequestOptions) => Promise<USBDevice | null>;
  refreshDevices: () => Promise<void>;
  connectDevice: (device: USBDevice) => Promise<boolean>;
  disconnectDevice: (device: USBDevice) => Promise<boolean>;
  clearError: () => void;
}

/**
 * USB设备检测和管理的自定义Hook
 */
export const useUSB = (): UseUSBReturn => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [devices, setDevices] = useState<USBDeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 使用ref来避免在事件监听器中的闭包问题
  const devicesRef = useRef<USBDeviceInfo[]>([]);
  devicesRef.current = devices;

  // 生成设备唯一ID
  const generateDeviceId = useCallback((device: USBDevice): string => {
    return `${device.vendorId}-${device.productId}-${device.serialNumber || 'unknown'}`;
  }, []);

  // 将USBDevice转换为USBDeviceInfo
  const createDeviceInfo = useCallback((device: USBDevice, connected: boolean = true): USBDeviceInfo => {
    return {
      device,
      id: generateDeviceId(device),
      name: device.productName || `设备 ${device.vendorId}:${device.productId}`,
      vendorId: device.vendorId,
      productId: device.productId,
      manufacturerName: device.manufacturerName,
      productName: device.productName,
      serialNumber: device.serialNumber,
      connected,
      lastConnected: new Date(),
    };
  }, [generateDeviceId]);

  // 检查浏览器是否支持WebUSB API
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'usb' in navigator && 'requestDevice' in navigator.usb;
      setIsSupported(supported);
      
      if (!supported) {
        setError('浏览器不支持 WebUSB API。请使用支持 WebUSB 的现代浏览器（如 Chrome 61+）。');
      }
    };

    checkSupport();
  }, []);

  // 处理设备连接事件
  const handleDeviceConnect = useCallback((event: USBConnectionEvent) => {
    const device = event.device;
    const deviceId = generateDeviceId(device);
    
    console.log('USB设备已连接:', device);
    
    setDevices(prevDevices => {
      const existingIndex = prevDevices.findIndex(d => d.id === deviceId);
      const deviceInfo = createDeviceInfo(device, true);
      
      if (existingIndex >= 0) {
        // 更新现有设备状态
        const newDevices = [...prevDevices];
        newDevices[existingIndex] = deviceInfo;
        return newDevices;
      } else {
        // 添加新设备
        return [...prevDevices, deviceInfo];
      }
    });
  }, [generateDeviceId, createDeviceInfo]);

  // 处理设备断开事件
  const handleDeviceDisconnect = useCallback((event: USBConnectionEvent) => {
    const device = event.device;
    const deviceId = generateDeviceId(device);
    
    console.log('USB设备已断开:', device);
    
    setDevices(prevDevices => {
      return prevDevices.map(d => 
        d.id === deviceId 
          ? { ...d, connected: false }
          : d
      );
    });
  }, [generateDeviceId]);

  // 设置事件监听器
  useEffect(() => {
    if (!isSupported) return;

    const usb = navigator.usb;
    
    usb.addEventListener('connect', handleDeviceConnect);
    usb.addEventListener('disconnect', handleDeviceDisconnect);

    return () => {
      usb.removeEventListener('connect', handleDeviceConnect);
      usb.removeEventListener('disconnect', handleDeviceDisconnect);
    };
  }, [isSupported, handleDeviceConnect, handleDeviceDisconnect]);

  // 请求访问USB设备
  const requestDevice = useCallback(async (options?: USBDeviceRequestOptions): Promise<USBDevice | null> => {
    if (!isSupported) {
      setError('浏览器不支持 WebUSB API');
      return null;
    }

    try {
      setError(null);
      
      const defaultOptions: USBDeviceRequestOptions = {
        filters: []
      };
      
      const device = await navigator.usb.requestDevice(options || defaultOptions);
      
      // 添加到设备列表
      const deviceInfo = createDeviceInfo(device, true);
      setDevices(prevDevices => {
        const existingIndex = prevDevices.findIndex(d => d.id === deviceInfo.id);
        if (existingIndex >= 0) {
          const newDevices = [...prevDevices];
          newDevices[existingIndex] = deviceInfo;
          return newDevices;
        } else {
          return [...prevDevices, deviceInfo];
        }
      });
      
      return device;
    } catch (err: any) {
      console.error('请求USB设备失败:', err);
      
      if (err.name === 'NotFoundError') {
        setError('未选择任何设备或找不到匹配的设备');
      } else if (err.name === 'SecurityError') {
        setError('安全错误：无法访问USB设备');
      } else {
        setError(`请求设备失败: ${err.message || err.toString()}`);
      }
      
      return null;
    }
  }, [isSupported, createDeviceInfo]);

  // 刷新设备列表
  const refreshDevices = useCallback(async (): Promise<void> => {
    if (!isSupported) return;

    try {
      setIsScanning(true);
      setError(null);
      
      const authorizedDevices = await navigator.usb.getDevices();
      
      const deviceInfos = authorizedDevices.map(device => 
        createDeviceInfo(device, true)
      );
      
      setDevices(deviceInfos);
    } catch (err: any) {
      console.error('刷新设备列表失败:', err);
      setError(`刷新设备列表失败: ${err.message || err.toString()}`);
    } finally {
      setIsScanning(false);
    }
  }, [isSupported, createDeviceInfo]);

  // 连接到设备
  const connectDevice = useCallback(async (device: USBDevice): Promise<boolean> => {
    try {
      setError(null);
      
      if (!device.opened) {
        await device.open();
      }
      
      // 更新设备状态
      const deviceId = generateDeviceId(device);
      setDevices(prevDevices => {
        return prevDevices.map(d => 
          d.id === deviceId 
            ? { ...d, connected: true, lastConnected: new Date() }
            : d
        );
      });
      
      return true;
    } catch (err: any) {
      console.error('连接设备失败:', err);
      setError(`连接设备失败: ${err.message || err.toString()}`);
      return false;
    }
  }, [generateDeviceId]);

  // 断开设备连接
  const disconnectDevice = useCallback(async (device: USBDevice): Promise<boolean> => {
    try {
      setError(null);
      
      if (device.opened) {
        await device.close();
      }
      
      // 更新设备状态
      const deviceId = generateDeviceId(device);
      setDevices(prevDevices => {
        return prevDevices.map(d => 
          d.id === deviceId 
            ? { ...d, connected: false }
            : d
        );
      });
      
      return true;
    } catch (err: any) {
      console.error('断开设备连接失败:', err);
      setError(`断开设备连接失败: ${err.message || err.toString()}`);
      return false;
    }
  }, [generateDeviceId]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 初始化时获取已授权的设备
  useEffect(() => {
    if (isSupported) {
      refreshDevices();
    }
  }, [isSupported, refreshDevices]);

  return {
    isSupported,
    devices,
    isScanning,
    error,
    requestDevice,
    refreshDevices,
    connectDevice,
    disconnectDevice,
    clearError,
  };
};
