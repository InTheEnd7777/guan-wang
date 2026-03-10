// proxy.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8082;

// 👇 第一步：优先提供本地静态文件（HTML/CSS/JS）
// 这样 /web/login.html 会从你本地加载，而不是代理到后端
app.use(express.static('.'));

// 👇 第二步：只代理 API 路径（根据你实际的接口前缀）
// 假设你的接口都是 /auth/xxx, /api/xxx 等
app.use('/', createProxyMiddleware({
  target: 'http://bm-ft.cn//api',
  changeOrigin: true
}));

// 如果还有其他接口路径，继续加
// app.use('/api', proxy);
// app.use('/user', proxy);

app.listen(PORT, () => {
  console.log(`✅ 服务启动: http://localhost:${PORT}`);
  console.log(`📁 静态文件来自本地`);
  console.log(`🔌 / 代理到 http://192.168.0.180:8081/`);
});