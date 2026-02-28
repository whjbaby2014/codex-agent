# InvestStart 青少年投资学习 App（Web 优先版）

可以部署并进行真实体验测试。当前项目已整理为**静态网页可直接上线**。

## Web 功能

1. **学习知识地图（学什么）**
   - 风险与收益基础
   - 资产配置与分散
   - 复利与定投
   - 投资行为心理
   - 合规与未成年人边界

2. **实操建议计划（怎么做）**
   - 按风险偏好（保守/平衡/进取）生成建议
   - 给出预算、仓位控制、复盘频率建议

3. **投资行为/结果持续记录（怎么复盘）**
   - 记录：日期、投入金额、投资标的、盈亏结果、定投频率、行为备注
   - 自动生成 AI 风格总结建议（本地规则）

4. **账号登录与个性化内容**
   - 支持创建/登录多个账号
   - 每个账号独立保存：学习进度、考试成绩、投资记录与 AI 建议

5. **模块考试**
   - 选择题作答
   - 计算并记录历史成绩

---

## 本地体验（无需 npm）

```bash
cd web
python3 -m http.server 4173
```

浏览器访问：
- http://localhost:4173

---

## 一键部署（推荐）

### 方案 A：Netlify（最简单）
1. 把仓库推到 GitHub。
2. 登录 Netlify -> Add new site -> Import from Git。
3. 选择本仓库，Build command 留空，Publish directory 填 `web`。
4. 点击 Deploy 即可。

> 项目已提供 `netlify.toml`，默认会把所有路由回退到 `/index.html`。

### 方案 B：Vercel
1. 登录 Vercel -> Add New Project -> 导入仓库。
2. Framework 选 `Other`。
3. Build command 留空，Output Directory 设为 `web`。
4. 部署完成后即可访问。

> 项目已提供 `vercel.json` 路由重写配置。


### Vercel 常见 404（`NOT_FOUND`）排查
如果你看到截图中的 `404: NOT_FOUND`，通常是以下原因之一：

1. **Output Directory 没填 `web`**（最常见）
   - 到 Vercel Project -> Settings -> Build and Deployment
   - 确认 Output Directory = `web`

2. **还在访问旧部署链接**
   - 打开 Deployments，使用最新一次 `Ready` 的域名

3. **仓库根目录没有 `index.html`，但路由没重写到 `web/index.html`**
   - 本项目已在 `vercel.json` 里把所有路径重写到 `/web/index.html`

4. **修改配置后没有触发重新部署**
   - 在 Deployments 里点击 `Redeploy`，或者 push 一次新 commit

快速自检顺序：
- 先看 Deployments 是否 `Ready`
- 再看 Output Directory 是否是 `web`
- 最后 Redeploy 一次

### 方案 C：Docker 部署（服务器）

```bash
docker build -t investstart-web .
docker run -d -p 8080:80 --name investstart investstart-web
```

浏览器访问：
- http://localhost:8080

---

## 文件说明

- `web/index.html`: Web 端完整实现（HTML + CSS + JavaScript）
- `netlify.toml`: Netlify 发布配置
- `vercel.json`: Vercel 发布配置
- `Dockerfile`: 容器部署配置
- `App.tsx`: React Native 原型（保留用于后续移动端继续开发）

## 后续计划

- 升级为 React + TypeScript 工程化结构
- 接入后端数据库（账号云端同步）
- 接入真实大模型 API（替代本地规则总结）
