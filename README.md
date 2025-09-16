# MC Web USB Manager

一个基于 React 18、TypeScript 和 Ant Design 5 的现代化 Web USB 设备管理应用程序。

## 特性

- ⚡️ React 18 与最新的 Hook 特性
- 🎨 Ant Design 5 - 企业级 UI 设计语言
- 🟦 TypeScript - 完整类型支持
- 🔌 WebUSB API - 完整的 USB 设备检测和管理
- 📱 响应式设计 - 支持移动端和桌面端
- 🔥 热重载开发体验
- 🚀 现代化开发体验
- 🛡️ 安全的设备操作封装

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript 5.9+
- **UI 组件库**: Ant Design 5
- **Web API**: WebUSB API
- **构建工具**: Webpack 5
- **编译器**: Babel with TypeScript preset
- **开发服务器**: webpack-dev-server

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
# 或者
npm run dev
```

应用程序将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
npm run build
```

构建文件将生成在 `dist` 目录中。

## USB 设备管理功能

### 🔌 核心功能

- **设备检测**: 自动检测 USB 设备的插入和拔出事件
- **设备授权**: 请求用户授权访问特定 USB 设备
- **设备连接**: 建立与 USB 设备的通信连接
- **设备信息**: 显示详细的设备硬件信息
- **实时监控**: 实时显示设备连接状态
- **设备管理**: 统一管理所有已授权的设备

### 🌐 浏览器兼容性

| 浏览器 | 版本要求 | 支持状态 |
|--------|----------|----------|
| Chrome | 61+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| Opera | 48+ | ✅ 完全支持 |
| Firefox | - | ❌ 不支持 |
| Safari | - | ❌ 不支持 |

**注意**: WebUSB API 目前仅在基于 Chromium 的浏览器中可用。

### 🔒 安全要求

- **HTTPS**: WebUSB API 只能在 HTTPS 环境中使用（开发环境 localhost 除外）
- **用户授权**: 所有设备访问都需要用户明确授权
- **安全上下文**: 必须在安全上下文中运行

### 📋 支持的设备类型

应用程序可以检测和管理以下类型的 USB 设备：

- 🖱️ **HID 设备**: 键盘、鼠标、游戏手柄
- 💾 **存储设备**: U盘、移动硬盘
- 🖨️ **打印机**: USB 打印机
- 📱 **移动设备**: 手机、平板（开发者模式）
- 🔧 **开发板**: Arduino、树莓派等
- 🎵 **音频设备**: USB 音频接口
- 📹 **视频设备**: USB 摄像头
- 🔌 **串口设备**: USB转串口适配器

## 项目结构

```
mc-web-usb/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── components/         # React 组件
│   │   ├── MainLayout.tsx  # 主布局组件（已移除）
│   │   └── USBManager.tsx  # USB 设备管理组件
│   ├── hooks/              # 自定义 Hooks
│   │   └── useUSB.ts       # USB 设备检测 Hook
│   ├── types/              # TypeScript 类型定义
│   │   └── usb.d.ts        # WebUSB API 类型定义
│   ├── utils/              # 工具函数
│   │   └── usbUtils.ts     # USB 操作工具函数
│   ├── App.tsx             # 主应用组件
│   ├── index.tsx           # 应用入口
│   └── index.css           # 全局样式
├── webpack.config.js       # Webpack 配置
├── .babelrc                # Babel 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖和脚本
└── README.md               # 项目说明
```

## 可用脚本

- `npm start` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run dev` - 启动开发服务器并自动打开浏览器

## 功能特性

### 主要组件

- **MainLayout**: 主布局组件，包含侧边栏导航和头部
- **响应式设计**: 支持移动端和桌面端适配
- **主题配置**: 可自定义 Ant Design 主题

### Ant Design 5 集成

项目已完整集成 Ant Design 5，包括：

- Layout 布局组件
- Menu 导航菜单
- Button 按钮组件
- Card 卡片组件
- Typography 文字排版
- Icon 图标组件
- Badge 徽标组件
- Dropdown 下拉菜单

## 开发指南

### 添加新组件

在 `src/components/` 目录下创建新的 TypeScript 组件文件：

```typescript
import React from 'react';
import { Button } from 'antd';

interface MyComponentProps {
  title?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title = "你好，世界！", onClick }) => {
  return (
    <Button type="primary" onClick={onClick}>
      {title}
    </Button>
  );
};

export default MyComponent;
```

### TypeScript 支持

项目完全支持 TypeScript，包括：

- 完整的类型检查
- Ant Design 组件的类型定义
- React Hook 的类型支持
- 自定义接口和类型定义

### 自定义主题

在 `src/App.tsx` 中修改 ConfigProvider 的 theme 配置：

```typescript
<ConfigProvider
  theme={{
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      // 添加更多主题配置
    },
  }}
>
  {/* 你的应用内容 */}
</ConfigProvider>
```

## 部署

### 构建

```bash
npm run build
```

### 部署到服务器

将 `dist` 目录中的文件上传到你的 Web 服务器即可。

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 许可证

MIT

## 🚀 使用指南

### 基本使用

1. **启动应用**
   ```bash
   pnpm start
   # 或
   npm start
   ```

2. **访问应用**
   - 开发环境: http://localhost:3000
   - 生产环境: 需要 HTTPS 域名

3. **连接 USB 设备**
   - 点击"添加设备"按钮
   - 在弹出的设备选择对话框中选择要访问的设备
   - 点击"连接"按钮建立设备连接

### 开发指南

#### 使用 USB Hook

```typescript
import { useUSB } from './hooks/useUSB';

const MyComponent: React.FC = () => {
  const {
    isSupported,
    devices,
    requestDevice,
    connectDevice,
    error,
  } = useUSB();

  const handleAddDevice = async () => {
    const device = await requestDevice({
      filters: [{ vendorId: 0x2341 }] // 只显示 Arduino 设备
    });
    
    if (device) {
      await connectDevice(device);
    }
  };

  // ...
};
```

#### 使用工具函数

```typescript
import usbUtils from './utils/usbUtils';

// 检查浏览器支持
const support = usbUtils.checkWebUSBSupport();
console.log('WebUSB支持:', support);

// 创建设备过滤器
const filters = usbUtils.createDeviceFilters.arduino();

// 提取设备信息
const deviceInfo = usbUtils.extractDeviceInfo(device);
console.log('设备信息:', deviceInfo);
```

#### 自定义设备操作

```typescript
import { safeDeviceOperation } from './utils/usbUtils';

const readFromDevice = async (device: USBDevice) => {
  const result = await safeDeviceOperation(
    async () => {
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      
      const data = await device.transferIn(1, 64);
      return data;
    },
    '读取设备数据失败'
  );

  if (result.success) {
    console.log('读取成功:', result.data);
  } else {
    console.error('读取失败:', result.error);
  }
};
```

### 常见问题

#### Q: 为什么设备列表为空？
A: 可能的原因：
- 浏览器不支持 WebUSB API
- 没有授权任何设备访问权限
- 设备没有正确连接到电脑

#### Q: 设备连接失败怎么办？
A: 检查以下几点：
- 设备是否支持 WebUSB
- 是否在 HTTPS 环境下运行（生产环境）
- 设备驱动是否正确安装
- 是否有其他应用程序占用设备

#### Q: 如何支持更多设备类型？
A: 修改设备过滤器，添加对应的厂商ID和产品ID：

```typescript
const customFilters = [
  { vendorId: 0x1234, productId: 0x5678 }, // 特定设备
  { classCode: 0x03 }, // HID 设备
  {} // 所有设备
];
```

## 贡献

欢迎提交 Issue 和 Pull Request。

---

Created with ❤️ using React 18, TypeScript & Ant Design 5
