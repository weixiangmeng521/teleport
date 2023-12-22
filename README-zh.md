# Teleport

- [英文](README.md)
- [中文](README-zh.md)
- [日本語](README-ja.md)

[![npm版本](https://badge.fury.io/js/@mwx47%2Fteleport.svg)](https://badge.fury.io/js/@mwx47%2Fteleport)
![NPM 下载量](https://img.shields.io/npm/dw/@mwx47/teleport)
![NPM 许可证](https://img.shields.io/npm/l/@mwx47/teleport)
![GitHub 工作流状态](https://github.com/weixiangmeng521/teleport/actions/workflows/master.yml/badge.svg)
[![GitHub 存储库](https://img.shields.io/badge/GitHub-Repo-blue.svg)](https://github.com/weixiangmeng521/teleport)

**Teleport** 是一个轻量且多功能的 TypeScript 事件处理库，灵感来自 RxJS。它通过单例模式有效地管理和通信应用程序中的事件。这种方法确保了事件管理器的单一、集中的实例，简化了在代码库的各个部分协调和处理事件的复杂性。

## 主要特点

- **单例设计**: 实现了单例模式，提供了一个统一且单一的实例，用于简化事件管理。
- **事件队列**: 支持事件处理程序排队，使得可以在相应的事件创建之前添加处理程序。
- **轻松的事件发射**: 轻松发射带有关联数据和可选回调函数的事件。
- **事件注册**: 简单注册特定事件的处理程序，便于响应应用程序中的各种场景。
- **维护**: 提供了删除特定事件处理程序、清除所有处理程序和重置整个事件管理器的方法。

这个解决方案独立存在，不依赖于 RxJS 或外部库。

## 安装

使用 npm 安装 **Teleport** 库：

```bash
npm install @mwx47/teleport
```

## 示例

### 第一个例子
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();

teleport.receive('eventName', (data) => {
    console.log('事件数据:', data); // ✅ 事件数据: 你好，世界！
});

// 发送数据
teleport.emit('eventName', "你好，世界！");
```

### 延迟订阅的示例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// 发送数据
teleport.emit('eventName', "你好，世界！");

// 虽然延迟了1000ms，但仍然可以获取数据
setTimeout(() => {
    teleport.receive('eventName', (data) => {
        console.log('事件数据:', data); // ✅ 事件数据: 你好，世界！ 
        // 移除处理程序
        teleport.removeHandle('eventName');
    });
}, 1000);
```

### 具有多个订阅的示例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// 发送数据
teleport.emit('eventName1', "东京！");
teleport.emit('eventName2', "中国！");
teleport.emit('eventName3', "伦敦！");

const subscriptions = ['eventName1', 'eventName2', 'eventName3'];
teleport.receive(subscriptions, (arg1:string, arg2:string, arg3:string) => {
    console.log('你好', arg1); // ✅ 你好，东京！
    console.log('你好', arg2); // ✅ 你好，中国！
    console.log('你好', arg3); // ✅ 你好，伦敦！
    // 移除处理程序
    teleport.removeHandle(subscriptions);
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

### 发射事件

```typescript
teleport.emit('eventName', 事件数据, () => {
    // 可选的回调函数
    console.log('事件发射成功！');
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
teleport.receive(['eventName1', 'eventName2'], (data1:any, data2:any) => {
    // 处理事件数据
    console.log('事件数据:', data1, data2);
});
// 或者
teleport.multiReceive(['eventName1', 'eventName2'], (data1:any, data2:any) => {
    // 处理事件数据
    console.log('事件数据:', data1, data2);
});
```

### 移除特定事件处理程序

```typescript
teleport.removeHandle('eventName');
```

### 移除特定多个事件处理程序

```typescript
teleport.removeHandle('eventName1');
// 或者
teleport.removeMultiHandle(['eventName1', 'eventName2']);
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

该项目基于 MIT 许可证授权 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。