# テレポート

- [英語](README.md)
- [中国語](README-zh.md)
- [日本語](README-ja.md)

[![npm バージョン](https://badge.fury.io/js/@mwx47%2Fteleport.svg)](https://badge.fury.io/js/@mwx47%2Fteleport)
![NPM ダウンロード数](https://img.shields.io/npm/dw/@mwx47/teleport)
![NPM ライセンス](https://img.shields.io/npm/l/@mwx47/teleport)
![GitHub ワークフロー ステータス](https://github.com/weixiangmeng521/teleport/actions/workflows/master.yml/badge.svg)
[![GitHub リポジトリ](https://img.shields.io/badge/GitHub-Repo-blue.svg)](https://github.com/weixiangmeng521/teleport)

**Teleport** は、TypeScript で作成され、RxJS からのインスピレーションを得た軽量で多機能なイベントハンドリングライブラリです。このライブラリを使用すると、アプリケーション内でのイベントの効果的な管理と通信が可能になり、シングルトンパターンを使用してイベントの調整と処理がコードベースのさまざまなセクションで簡略化されます。

## 主な特徴

- **シングルトン設計**: シングルトンパターンを実装し、効率的なイベント管理のために統一された単一のインスタンスを提供します。
- **イベントキュー**: イベントハンドラのキューイングを可能にし、対応するイベントが作成される前にハンドラを追加できます。
- **簡単なイベント発射**: 関連するデータとオプションのコールバック関数を使用して簡単にイベントを発射できます。
- **イベントの登録**: 特定のイベントのためのハンドラを簡単に登録し、アプリケーション内のさまざまなシナリオに対応しやすくします。
- **メンテナンス**: 特定のイベントハンドラを削除し、すべてのハンドラをクリアし、イベントマネージャ全体をリセットするためのメソッドを提供します。

このソリューションは RxJS や外部ライブラリに依存していません。

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

### 遅延サブスクリプションの例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// データを送信
teleport.emit('eventName', "こんにちは、世界！");

// 1000ms 遅れていてもデータは取得できます
setTimeout(() => {
    teleport.receive('eventName', (data) => {
        console.log('イベントデータ:', data); // ✅ イベントデータ: こんにちは、世界！ 
        // ハンドラを削除
        teleport.removeHandle('eventName');
    });
}, 1000);
```

### 複数のサブスクリプションの例
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// データを送信
teleport.emit('eventName1', "東京！");
teleport.emit('eventName2', "中国！");
teleport.emit('eventName3', "ロンドン！");

const subscriptions = ['eventName1', 'eventName2', 'eventName3'];
teleport.receive(subscriptions, (arg1:string, arg2:string, arg3:string) => {


    console.log('こんにちは', arg1); // ✅ こんにちは、東京！
    console.log('こんにちは', arg1); // ✅ こんにちは、中国！
    console.log('こんにちは', arg1); // ✅ こんにちは、ロンドン！
    // ハンドラを削除
    teleport.removeHandle(subscriptions);
});
```

## 使用法

### インポート

```typescript
import { Teleport } from '@mwx47/teleport';
```

### シングルトンインスタンスの取得または作成

```typescript
const teleport = new Teleport();
```

### イベントの発射

```typescript
teleport.emit('eventName', eventData, () => {
    // オプションのコールバック関数
    console.log('イベントが正常に発射されました！');
});
```

### イベントの受信と処理

```typescript
teleport.receive('eventName', (data) => {
    // イベントデータを処理
    console.log('イベントデータ:', data);
});
```

### イベントの受信と処理

```typescript
teleport.receive(['eventName1', 'eventName2'], (data1:any, data2:any) => {
    // イベントデータを処理
    console.log('イベントデータ:', data1, data2);
});
// または
teleport.multiReceive(['eventName1', 'eventName2'], (data1:any, data2:any) => {
    // イベントデータを処理
    console.log('イベントデータ:', data1, data2);
});
```

### 特定のイベントハンドラの削除

```typescript
teleport.removeHandle('eventName');
```

### 特定の複数のイベントハンドラの削除

```typescript
teleport.removeHandle(['eventName1', 'eventName2']);
// または
teleport.removeMultiHandle(['eventName1', 'eventName2']);
```

### すべてのイベントハンドラの削除

```typescript
teleport.removeAllHandlers();
```

### イベントマネージャのクリア

```typescript
teleport.clear();
```

## 貢献

貢献は歓迎されます！問題を開く、プルリクエストを送信する、または **Teleport** ライブラリを改善するための提案を提供するなど、お気軽にご参加ください。

## ライセンス

このプロジェクトは MIT ライセンスのもとで提供されています - 詳細については [LICENSE](LICENSE) ファイルを参照してください。