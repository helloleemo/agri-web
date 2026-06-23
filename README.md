# Agri Web

農產品直銷平台客戶端（前台）。基於 React + TypeScript + Vite + Material-UI 構建。

## 快速開始

### 環境要求
- Node.js 18+
- npm 或 yarn

### 1. 安裝依賴

```bash
cd agri-web
npm install
```

### 2. 環境配置

複製 `.env.example` 為 `.env.local`（如果存在），並配置 API 服務地址：

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### 3. 開發服務

啟動開發服務器：
```bash
npm run dev
```

預設運行在 `http://localhost:5173`

### 4. 生產構建

構建生產版本：
```bash
npm run build
```

生成的文件位於 `dist/` 目錄。

## 可用腳本

- `npm run dev` - 啟動開發服務器
- `npm run build` - 構建生產版本
- `npm run preview` - 本地預覽生產構建
- `npm run lint` - 運行 ESLint

## 核心功能

### 用戶功能

- **首頁** - 展示產品推介、購物流程、社群鏈接
- **產品瀏覽** - 商品列表、篩選、搜尋
- **購物車** - 添加商品、管理數量、計算總額
- **下單流程** - 配送地址、配送時間、支付方式選擇
- **訂單查詢** - 通過訂單號 + Email 查看訂單狀態、配送進度、收件信息
- **賬號管理** - 登錄、註冊、Email 驗證
- **用戶信息** - 地址管理、訂單歷史

### 動態內容

首頁及關鍵頁面的文字、圖片由後台 CMS 管理：

- **首頁** - 英雄圖、主標題、說明圖塊、三步流程、底部 CTA、Footer
- **產品頁** - 頂部 banner 圖（與訂購流程頁共用）
- **訂單查詢頁** - 查詢說明文案、右側背景圖

所有內容實時從後端加載，後台修改立即生效。

## 項目結構

```
src/
├── api/                 # API 服務層
│   ├── base/           # 基礎 API 配置
│   ├── site-content/   # 頁面內容管理 API
│   └── ...
├── components/         # React 組件
│   ├── layout/         # 佈局（Header、Footer）
│   ├── common/         # 通用組件
│   └── ...
├── pages/              # 頁面組件
│   ├── $index/
│   │   └── MainPage.tsx         # 首頁
│   ├── $mekarang/
│   │   ├── Layout.tsx           # 購物模塊佈局
│   │   ├── ProductsPage.tsx     # 產品列表
│   │   ├── $orders/
│   │   │   └── OrdersQueryPage.tsx  # 訂單查詢頁
│   │   └── ...
│   └── ...
├── routes/             # 路由配置
├── contexts/           # React Context（認證狀態等）
├── hooks/              # 自定義 Hooks
├── theme/              # 主題配置
└── main.tsx
```

## 頁面詳解

### 首頁 (/)

展示品牌故事、產品推介、購物流程、社群鏈接。內容完全由 CMS 管理：
- 英雄圖、標題、按鈕
- 兩個展示圖塊
- 三步訂購流程
- 底部 CTA
- Footer（社群鏈接）

### 產品列表 (/mekarang/products)

顯示商品列表，支持：
- 分類篩選
- 價格排序
- 添加到購物車

頁面頂部 banner 由 CMS 管理。

### 訂單查詢 (/mekarang/orders/query)

輸入訂單號 + Email 查詢訂單詳情：
- 付款狀態
- 配送進度
- 收件信息

頁面說明文案與右側圖片由 CMS 管理。

### 購物流程

1. 瀏覽產品 → 添加購物車
2. 查看購物車 → 確認數量
3. 結帳 → 填寫地址、選擇配送時間
4. 支付 → 選擇支付方式、確認訂單
5. 訂單完成 → 可隨時查詢進度

## 認證流程

- **註冊** - Email 註冊，需驗證 Email 地址
- **登錄** - 賬號密碼登錄，獲得 JWT Token
- **Token 管理** - 自動刷新過期 Token
- **退出登錄** - 清除本地 Token

## 數據綁定

所有關鍵頁面文字與圖片通過 CMS API 動態加載，支持：
- 後台實時更新
- API 失敗時自動使用默認值（不會白屏）
- 圖片自動轉換 WebP 格式

## 開發約定

### TypeScript
- 嚴格模式啟用
- 優先使用類型推斷

### 組件
- 功能組件優先
- 使用 React Hooks
- 組件間通過 Props 或 Context 通信

### 樣式
- Material-UI 組件庫
- sx prop 用於樣式定制
- 響應式設計（xs, sm, md, lg, xl）

## 常見問題

### 首頁內容不顯示
- 檢查後端是否啟動
- 查看瀏覽器控制台是否有 API 錯誤
- 檢查 `.env.local` API_BASE_URL 配置

### 圖片加載失敗
- 驗證 Supabase 配置是否正確
- 檢查網絡連接
- 查看瀏覽器開發者工具網絡標籤

### 訂單查詢顯示無數據
- 確保輸入了正確的訂單號和 Email
- 檢查訂單是否真實存在
- Email 大小寫敏感

## 部署

構建後的 `dist` 目錄可部署到任何靜態服務器或 CDN。

### Nginx 示例

```nginx
server {
    listen 80;
    server_name example.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 環境變量

部署時確保配置正確的：
- `VITE_API_BASE_URL` - 後端 API 地址
- Supabase 相關配置（如果前端直連）

## 性能優化

- 代碼分割（路由級別）
- 圖片懶加載
- 緩存策略（Cache-Control）
