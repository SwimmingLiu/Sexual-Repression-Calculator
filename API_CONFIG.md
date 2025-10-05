# 微信小程序API配置说明

## 配置API地址

### 开发环境

开发环境已经配置了代理，所以不需要修改任何配置。代理会自动将 `/api/wx` 的请求转发到 `http://localhost:8090/common/wx`。

### 生产环境

如果你需要修改API的基础URL，有两种方式：

#### 方式一：通过环境变量（推荐）

1. 复制 `.env.example` 文件并重命名为 `.env`
2. 在 `.env` 文件中设置 `WX_API_BASE_URL`：

```env
WX_API_BASE_URL=https://your-api-domain.com
```

#### 方式二：直接修改配置文件

打开 `src/lib/api-config.ts` 文件，修改 `WX_MINIPROGRAM_BASE_URL` 的值：

```typescript
export const API_CONFIG = {
  WX_MINIPROGRAM_BASE_URL: 'https://your-api-domain.com',
  // ...
};
```

### 修改代理目标地址

如果你的后端API地址不是 `http://localhost:8090`，可以修改 `rsbuild.config.ts` 文件中的代理配置：

```typescript
proxy: {
  '/api/wx': {
    target: 'http://your-backend-address:port', // 修改这里
    changeOrigin: true,
    pathRewrite: {
      '^/api/wx': '/common/wx',
    },
  },
}
```

## API接口说明

### 请求地址
- 开发环境：`/api/wx/public/url`（通过代理）
- 生产环境：`${WX_API_BASE_URL}/api/wx/public/url`

### 请求方法
POST

### 请求参数
```json
{
  "path": "/pages/index/index",        // 小程序页面路径
  "expire_type": 1,                     // 失效类型：0-永久有效，1-失效时间间隔
  "expire_interval": 1,                 // 失效时间间隔（天）
  "env_version": "release"              // 版本：release-正式版，trial-体验版，develop-开发版
}
```

### 响应格式
```json
{
  "url_link": "weixin://xxx",          // 微信小程序URL链接
  "errcode": 0,                        // 错误码，0表示成功
  "errmsg": "ok"                       // 错误信息
}
```

## 功能说明

当用户点击"小橙有门"按钮时：
1. 显示二维码弹窗（原有功能保留）
2. 同时调用微信小程序API获取URL链接
3. 如果成功获取链接，尝试在新窗口打开微信小程序
4. 如果API调用失败，不影响二维码弹窗的显示（静默失败）

## 注意事项

1. 开发环境使用代理可以避免CORS问题
2. 生产环境需要确保后端API支持CORS或配置了正确的CORS头
3. 微信小程序链接只能在微信环境中正常打开
4. 如果浏览器阻止弹窗，系统会尝试直接跳转或复制链接到剪贴板

