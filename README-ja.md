# Teleport

- [English](README.md)
- [中文](README-zh.md)
- [日本語](README-ja.md)

[![npm version](https://badge.fury.io/js/@mwx47%2Fteleport.svg)](https://badge.fury.io/js/@mwx47%2Fteleport)
![NPM Downloads](https://img.shields.io/npm/dw/@mwx47/teleport)
![NPM License](https://img.shields.io/npm/l/@mwx47/teleport)
![GitHub Workflow Status](https://github.com/weixiangmeng521/teleport/actions/workflows/master.yml/badge.svg)
[![GitHub 仓库](https://img.shields.io/badge/GitHub-Repo-blue.svg)](https://github.com//weixiangmeng521/teleport)

**Teleport** は、TypeScript 向けの軽量で多機能なイベントハンドリングライブラリで、RxJS からインスパイアを得ています。このライブラリを使用すると、アプリケーション内でのイベントを効果的に管理および通信することができます。これにより、イベントマネージャーの単一かつ中央集権的なインスタンスが保証され、コードベースのさまざまなセクションでのイベントの調整とハンドリングが簡素化されます。

## 主な特徴

- **シングルトンデザイン**: シングルトンパターンを実装し、効率的なイベント管理のための統一された唯一のインスタンスを提供します。
- **イベントキュー**: イベントハンドラのキューイングを容易にし、対応するイベントが作成される前にハンドラを追加できます。
- **簡単なイベント発生**: 関連するデータとオプションのコールバック関数を使用して簡単にイベントを発生させることができます。
- **イベント登録**: 特定のイベントのハンドラを簡単に登録し、アプリケーション内のさまざまなシナリオに対応できます。
- **メンテナンス**: 特定のイベントハンドラを削除したり、すべてのハンドラをクリアしたり、イベントマネージャ全体をリセットしたりするためのメソッドを提供します。

このソリューションは、RxJS や外部ライブラリに依存せず、独立しています。

## インストール

npm を使用して **Teleport** ライブラリをインストールします：

```bash
npm install @mwx47/teleport
```

## 例

### 最初の例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();

teleport.receive('eventName', (data) => {
    console.log('イベントデータ:', data); // ✅ イベントデータ: こんにちは、世界！ 
});

// データを送信
teleport.emit('eventName', "こんにちは、世界！");
```

### 遅延サブスクリプションのある例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// データを送信
teleport.emit('eventName', "こんにちは、世界！");

// 1000ms 遅れても、データを取得できます
setTimeout(() => {
    teleport.receive('eventName', (data) => {
        console.log('イベントデータ:', data); // ✅ イベントデータ: こんにちは、世界！ 
    });
}, 1000);
```

### 複数のサブスクリプションのある例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// データを送信
teleport.emit('eventName1', "東京！");
teleport.emit('eventName2', "中国！");
teleport.emit('eventName3', "ロンドン！");

const subscriptions = ['eventName1', 'eventName2', 'eventName3'];
teleport.receive(subscriptions, (arg1:string, arg2:string, arg3:string) => {
    console.log('こんにちは', arg1); // ✅ こんにちは 東京！
    console.log('こんにちは', arg2); // ✅ こんにちは 中国！
    console.log('こんにちは', arg3); // ✅ こんにちは ロンドン！
});
```

## 使用法

### インポート

```typescript
import { Teleport } from '@mwx47/teleport';
```

### シングルトンインスタンスを取得または作成

```typescript
const teleport = new Teleport();
```

### イベントを発生させる

```typescript
teleport.emit('eventName', eventData, () => {
    // オプションのコールバック関数
    console.log('イベントが正常に発生しました！');
});
```

### イベントを受信し処理する

```typescript
teleport.receive('eventName', (data) => {
    // イベントデータを処理
    console.log('イベントデータ:', data);
});
```

### イベントを受信し処理する

```typescript
teleport.multiReceive(['eventName1', 'eventName2'], (data1:any, data2:any) => {
    // イベントデータを処理
    console.log('イベントデータ:', data1, data2);
});
```

### 特定のイベントハンドラを削除する

```typescript
teleport.removeHandle('eventName');
```

### すべてのイベントハンドラを削除する

```typescript
teleport.removeAllHandlers();
```

### イベントマネージャをクリアする

```typescript
teleport.clear();
```

## 貢献

貢献は歓迎されています！質問