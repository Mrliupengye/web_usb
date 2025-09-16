import type { USBDevice, USBDeviceFilter } from '../types/usb';

// 常见USB设备类别定义
export const USB_DEVICE_CLASSES = {
  AUDIO: 0x01,
  CDC_CONTROL: 0x02,
  HID: 0x03,
  PHYSICAL: 0x05,
  IMAGE: 0x06,
  PRINTER: 0x07,
  MASS_STORAGE: 0x08,
  HUB: 0x09,
  CDC_DATA: 0x0A,
  SMART_CARD: 0x0B,
  CONTENT_SECURITY: 0x0D,
  VIDEO: 0x0E,
  PERSONAL_HEALTHCARE: 0x0F,
  AUDIO_VIDEO: 0x10,
  BILLBOARD: 0x11,
  TYPE_C_BRIDGE: 0x12,
  DIAGNOSTIC: 0xDC,
  WIRELESS: 0xE0,
  MISCELLANEOUS: 0xEF,
  APPLICATION_SPECIFIC: 0xFE,
  VENDOR_SPECIFIC: 0xFF,
} as const;

// 常见厂商ID
export const VENDOR_IDS = {
  APPLE: 0x05AC,
  MICROSOFT: 0x045E,
  GOOGLE: 0x18D1,
  SAMSUNG: 0x04E8,
  HUAWEI: 0x12D1,
  XIAOMI: 0x2717,
  REALTEK: 0x0BDA,
  INTEL: 0x8086,
  ARDUINO: 0x2341,
  FTDI: 0x0403,
} as const;

// USB传输方向
export const USB_DIRECTIONS = {
  OUT: 'out' as const,
  IN: 'in' as const,
};

// USB传输状态
export const USB_TRANSFER_STATUS = {
  OK: 'ok' as const,
  STALL: 'stall' as const,
  BABBLE: 'babble' as const,
};

/**
 * 获取设备类别名称
 */
export const getDeviceClassName = (deviceClass: number): string => {
  const classNames: Record<number, string> = {
    [USB_DEVICE_CLASSES.AUDIO]: '音频设备',
    [USB_DEVICE_CLASSES.CDC_CONTROL]: 'CDC控制设备',
    [USB_DEVICE_CLASSES.HID]: '人机交互设备',
    [USB_DEVICE_CLASSES.PHYSICAL]: '物理设备',
    [USB_DEVICE_CLASSES.IMAGE]: '图像设备',
    [USB_DEVICE_CLASSES.PRINTER]: '打印机',
    [USB_DEVICE_CLASSES.MASS_STORAGE]: '大容量存储设备',
    [USB_DEVICE_CLASSES.HUB]: 'USB集线器',
    [USB_DEVICE_CLASSES.CDC_DATA]: 'CDC数据设备',
    [USB_DEVICE_CLASSES.SMART_CARD]: '智能卡',
    [USB_DEVICE_CLASSES.CONTENT_SECURITY]: '内容安全设备',
    [USB_DEVICE_CLASSES.VIDEO]: '视频设备',
    [USB_DEVICE_CLASSES.PERSONAL_HEALTHCARE]: '个人医疗设备',
    [USB_DEVICE_CLASSES.AUDIO_VIDEO]: '音视频设备',
    [USB_DEVICE_CLASSES.BILLBOARD]: '广告牌设备',
    [USB_DEVICE_CLASSES.TYPE_C_BRIDGE]: 'Type-C桥接器',
    [USB_DEVICE_CLASSES.DIAGNOSTIC]: '诊断设备',
    [USB_DEVICE_CLASSES.WIRELESS]: '无线设备',
    [USB_DEVICE_CLASSES.MISCELLANEOUS]: '其他设备',
    [USB_DEVICE_CLASSES.APPLICATION_SPECIFIC]: '应用专用设备',
    [USB_DEVICE_CLASSES.VENDOR_SPECIFIC]: '厂商专用设备',
  };

  return classNames[deviceClass] || `未知设备类别 (0x${deviceClass.toString(16).toUpperCase()})`;
};

/**
 * 获取厂商名称
 */
export const getVendorName = (vendorId: number): string => {
  const vendorNames: Record<number, string> = {
    [VENDOR_IDS.APPLE]: 'Apple Inc.',
    [VENDOR_IDS.MICROSOFT]: 'Microsoft Corporation',
    [VENDOR_IDS.GOOGLE]: 'Google Inc.',
    [VENDOR_IDS.SAMSUNG]: 'Samsung Electronics',
    [VENDOR_IDS.HUAWEI]: 'Huawei Technologies',
    [VENDOR_IDS.XIAOMI]: 'Xiaomi Corporation',
    [VENDOR_IDS.REALTEK]: 'Realtek Semiconductor',
    [VENDOR_IDS.INTEL]: 'Intel Corporation',
    [VENDOR_IDS.ARDUINO]: 'Arduino LLC',
    [VENDOR_IDS.FTDI]: 'Future Technology Devices International',
  };

  return vendorNames[vendorId] || `未知厂商 (0x${vendorId.toString(16).toUpperCase().padStart(4, '0')})`;
};

/**
 * 创建常用设备过滤器
 */
export const createDeviceFilters = {
  // 所有设备
  all: (): USBDeviceFilter[] => [{}],
  
  // HID设备（键盘、鼠标等）
  hid: (): USBDeviceFilter[] => [
    { classCode: USB_DEVICE_CLASSES.HID }
  ],
  
  // 大容量存储设备
  massStorage: (): USBDeviceFilter[] => [
    { classCode: USB_DEVICE_CLASSES.MASS_STORAGE }
  ],
  
  // 串口设备
  serial: (): USBDeviceFilter[] => [
    { classCode: USB_DEVICE_CLASSES.CDC_CONTROL },
    { vendorId: VENDOR_IDS.FTDI }, // FTDI串口芯片
  ],
  
  // Arduino设备
  arduino: (): USBDeviceFilter[] => [
    { vendorId: VENDOR_IDS.ARDUINO }
  ],
  
  // 特定厂商设备
  vendor: (vendorId: number): USBDeviceFilter[] => [
    { vendorId }
  ],
  
  // 特定产品
  product: (vendorId: number, productId: number): USBDeviceFilter[] => [
    { vendorId, productId }
  ],
};

/**
 * 设备信息提取工具
 */
export const extractDeviceInfo = (device: USBDevice) => {
  return {
    basicInfo: {
      vendorId: device.vendorId,
      productId: device.productId,
      manufacturerName: device.manufacturerName || getVendorName(device.vendorId),
      productName: device.productName || '未知产品',
      serialNumber: device.serialNumber || '无序列号',
      deviceClass: device.deviceClass,
      deviceClassName: getDeviceClassName(device.deviceClass),
    },
    
    version: {
      device: `${device.deviceVersionMajor}.${device.deviceVersionMinor}.${device.deviceVersionSubminor}`,
      usb: `${device.usbVersionMajor}.${device.usbVersionMinor}.${device.usbVersionSubminor}`,
    },
    
    status: {
      opened: device.opened,
      configurationCount: device.configurations.length,
    },
    
    displayName: device.productName || 
      `${getVendorName(device.vendorId)} ${device.vendorId.toString(16).toUpperCase()}:${device.productId.toString(16).toUpperCase()}`,
  };
};

/**
 * 字节数组转换为十六进制字符串
 */
export const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
};

/**
 * 十六进制字符串转换为字节数组
 */
export const hexToBytes = (hex: string): Uint8Array => {
  const cleanHex = hex.replace(/\s+/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  
  return bytes;
};

/**
 * 安全的设备操作包装器
 */
export const safeDeviceOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = '设备操作失败'
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error: any) {
    console.error(errorMessage, error);
    
    let errorMsg = errorMessage;
    
    if (error.name === 'NetworkError') {
      errorMsg += ': 设备无响应或已断开连接';
    } else if (error.name === 'SecurityError') {
      errorMsg += ': 安全错误，无法访问设备';
    } else if (error.name === 'NotSupportedError') {
      errorMsg += ': 设备不支持此操作';
    } else if (error.name === 'InvalidStateError') {
      errorMsg += ': 设备状态无效';
    } else if (error.message) {
      errorMsg += `: ${error.message}`;
    }
    
    return { success: false, error: errorMsg };
  }
};

/**
 * 检查浏览器WebUSB支持
 */
export const checkWebUSBSupport = () => {
  const isSupported = 'usb' in navigator;
  
  return {
    supported: isSupported,
    message: isSupported 
      ? 'WebUSB API 可用' 
      : 'WebUSB API 不可用，请使用支持的浏览器（Chrome 61+, Edge 79+, Opera 48+）',
    features: {
      requestDevice: isSupported && 'requestDevice' in navigator.usb,
      getDevices: isSupported && 'getDevices' in navigator.usb,
      events: isSupported && 'addEventListener' in navigator.usb,
    }
  };
};

/**
 * 常用控制传输参数
 */
export const USB_CONTROL_TRANSFER = {
  // 标准请求类型
  STANDARD: {
    GET_STATUS: 0x00,
    CLEAR_FEATURE: 0x01,
    SET_FEATURE: 0x03,
    SET_ADDRESS: 0x05,
    GET_DESCRIPTOR: 0x06,
    SET_DESCRIPTOR: 0x07,
    GET_CONFIGURATION: 0x08,
    SET_CONFIGURATION: 0x09,
    GET_INTERFACE: 0x0A,
    SET_INTERFACE: 0x0B,
    SYNCH_FRAME: 0x0C,
  },
  
  // 描述符类型
  DESCRIPTORS: {
    DEVICE: 0x01,
    CONFIGURATION: 0x02,
    STRING: 0x03,
    INTERFACE: 0x04,
    ENDPOINT: 0x05,
  }
} as const;

export default {
  USB_DEVICE_CLASSES,
  VENDOR_IDS,
  USB_DIRECTIONS,
  USB_TRANSFER_STATUS,
  getDeviceClassName,
  getVendorName,
  createDeviceFilters,
  extractDeviceInfo,
  bytesToHex,
  hexToBytes,
  safeDeviceOperation,
  checkWebUSBSupport,
  USB_CONTROL_TRANSFER,
};
