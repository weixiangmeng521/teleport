# Teleport

- [English](README.md)
- [中文](README-zh.md)
- [日本語](README-ja.md)

[![npm version](https://badge.fury.io/js/@mwx47%2Fteleport.svg)](https://badge.fury.io/js/@mwx47%2Fteleport)
![NPM Downloads](https://img.shields.io/npm/dw/@mwx47/teleport)
![NPM License](https://img.shields.io/npm/l/@mwx47/teleport)
![GitHub Workflow Status](https://github.com/weixiangmeng521/teleport/actions/workflows/master.yml/badge.svg)
[![GitHub 仓库](https://img.shields.io/badge/GitHub-Repo-blue.svg)](https://github.com//weixiangmeng521/teleport)

**Teleport** 是一个轻量级、多功能的 TypeScript 事件处理库，受 RxJS 启发而创建。它使您能够使用单例模式在应用程序中有效地管理和通信事件。这种方法保证了事件管理器的单一、集中的实例，简化了在代码库的各个部分之间进行事件协调和处理的操作。

## 主要特性

- **单例设计**：实现了单例模式，提供了一个统一而唯一的实例，用于简化事件管理。
- **事件队列**：支持事件处理程序队列，使得可以在相应事件创建之前轻松添加处理程序。
- **轻松的事件触发**：轻松触发带有关联数据和可选回调函数的事件。
- **事件注册**：简单注册特定事件的处理程序，使得响应应用程序中不同场景变得容易。
- **维护**：提供了删除特定事件处理程序、清除所有处理程序和重置整个事件管理器的方法。

这个解决方案是独立的，不依赖于 RxJS 或外部库。

## 安装

使用 npm 安装 **Teleport** 库：

```bash
npm install @mwx47/teleport
```

## 示例

### 第一个示例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();

teleport.receive('eventName', (data) => {
    console.log('事件数据:', data); // ✅ 事件数据: 你好，世界！ 
});

// 发送数据
teleport.emit('eventName', "你好，世界！");
```

### 具有延迟订阅的示例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// 发送数据
teleport.emit('eventName', "你好，世界！");

// 虽然延迟了1000毫秒，但仍然可以获取到数据
setTimeout(() => {
    teleport.receive('eventName', (data) => {
        console.log('事件数据:', data); // ✅ 事件数据: 你好，世界！ 
    });
}, 1000);
```

### 具有多个订阅的示例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// 发送数据
teleport.emit('eventName1', "东京!");
teleport.emit('eventName2', "中国!");
teleport.emit('eventName3', "伦敦!");

const subscriptions = ['eventName1', 'eventName2', 'eventName3'];
teleport.receive(subscriptions, (arg1:string, arg2:string, arg3:string) => {
    console.log('你好', arg1); // ✅ 你好 东京！
    console.log('你好', arg2); // ✅ 你好 中国！
    console.log('你好', arg3); // ✅ 你好 伦敦！
});
```

## 用法

### 导入

```typescript
import { Teleport } from '@mwx47/teleport';
```

### 获取或创建单例实例

```typescript
const teleport = new Teleport();
```

### 发送事件

```typescript
teleport.emit('eventName', eventData, () => {
    // 可选的回调函数
    console.log('事件成功触发！');
});
```

### 接收和处理事件

```typescript
teleport.receive('eventName', (data) => {
    // 处理事件数据
    console.log('事件数据:', data);
});
```

### 接收和处理事件

```typescript
teleport.multiReceive(['eventName1', 'eventName2'], (data1:any, data2:any) => {
    // 处理事件数据
    console.log('事件数据:', data1, data2);
});
```

### 移除特定事件处理程序

```typescript
teleport.removeHandle('eventName');
```

### 移除所有事件处理程序

```typescript
teleport.removeAllHandlers();
```

### 清除事件管理器

```typescript
teleport.clear();
```

## 贡献

欢迎贡献！请随时提出问题、提交拉取请求或提供改进 **Teleport** 库的建议。

## 许可证

该项目根据 MIT 许可证许可 - 有关详细信息，请参见 [LICENSE](LICENSE) 文件。