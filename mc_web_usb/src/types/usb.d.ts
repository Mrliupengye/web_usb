// USB Web API 类型定义
export interface USBDevice {
  readonly deviceClass: number;
  readonly deviceProtocol: number;
  readonly deviceSubclass: number;
  readonly deviceVersionMajor: number;
  readonly deviceVersionMinor: number;
  readonly deviceVersionSubminor: number;
  readonly manufacturerName?: string;
  readonly productId: number;
  readonly productName?: string;
  readonly serialNumber?: string;
  readonly usbVersionMajor: number;
  readonly usbVersionMinor: number;
  readonly usbVersionSubminor: number;
  readonly vendorId: number;
  readonly configurations: USBConfiguration[];
  readonly opened: boolean;

  open(): Promise<void>;
  close(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  releaseInterface(interfaceNumber: number): Promise<void>;
  selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
  controlTransferIn(setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult>;
  controlTransferOut(setup: USBControlTransferParameters, data?: BufferSource): Promise<USBOutTransferResult>;
  clearHalt(direction: USBDirection, endpointNumber: number): Promise<void>;
  transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
  transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
  isochronousTransferIn(endpointNumber: number, packetLengths: number[]): Promise<USBIsochronousInTransferResult>;
  isochronousTransferOut(endpointNumber: number, data: BufferSource, packetLengths: number[]): Promise<USBIsochronousOutTransferResult>;
  reset(): Promise<void>;
}

export interface USBConfiguration {
  readonly configurationValue: number;
  readonly configurationName?: string;
  readonly interfaces: USBInterface[];
}

export interface USBInterface {
  readonly interfaceNumber: number;
  readonly alternate: USBAlternateInterface;
  readonly alternates: USBAlternateInterface[];
  readonly claimed: boolean;
}

export interface USBAlternateInterface {
  readonly alternateSetting: number;
  readonly interfaceClass: number;
  readonly interfaceSubclass: number;
  readonly interfaceProtocol: number;
  readonly interfaceName?: string;
  readonly endpoints: USBEndpoint[];
}

export interface USBEndpoint {
  readonly endpointNumber: number;
  readonly direction: USBDirection;
  readonly type: USBEndpointType;
  readonly packetSize: number;
}

export interface USBControlTransferParameters {
  requestType: USBRequestType;
  recipient: USBRecipient;
  request: number;
  value: number;
  index: number;
}

export interface USBInTransferResult {
  readonly data: DataView;
  readonly status: USBTransferStatus;
}

export interface USBOutTransferResult {
  readonly bytesWritten: number;
  readonly status: USBTransferStatus;
}

export interface USBIsochronousInTransferPacket {
  readonly data: DataView;
  readonly status: USBTransferStatus;
}

export interface USBIsochronousInTransferResult {
  readonly data: DataView;
  readonly packets: USBIsochronousInTransferPacket[];
}

export interface USBIsochronousOutTransferPacket {
  readonly bytesWritten: number;
  readonly status: USBTransferStatus;
}

export interface USBIsochronousOutTransferResult {
  readonly packets: USBIsochronousOutTransferPacket[];
}

export type USBDirection = 'in' | 'out';
export type USBEndpointType = 'bulk' | 'interrupt' | 'isochronous';
export type USBRequestType = 'standard' | 'class' | 'vendor';
export type USBRecipient = 'device' | 'interface' | 'endpoint' | 'other';
export type USBTransferStatus = 'ok' | 'stall' | 'babble';

export interface USBDeviceFilter {
  vendorId?: number;
  productId?: number;
  classCode?: number;
  subclassCode?: number;
  protocolCode?: number;
  serialNumber?: string;
}

export interface USBDeviceRequestOptions {
  filters: USBDeviceFilter[];
}

export interface USB extends EventTarget {
  getDevices(): Promise<USBDevice[]>;
  requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
  addEventListener(type: 'connect', listener: (ev: USBConnectionEvent) => void): void;
  addEventListener(type: 'disconnect', listener: (ev: USBConnectionEvent) => void): void;
  removeEventListener(type: 'connect', listener: (ev: USBConnectionEvent) => void): void;
  removeEventListener(type: 'disconnect', listener: (ev: USBConnectionEvent) => void): void;
}

export interface USBConnectionEvent extends Event {
  readonly device: USBDevice;
}

// 扩展全局 Navigator 接口
declare global {
  interface Navigator {
    usb: USB;
  }
}

export {};
