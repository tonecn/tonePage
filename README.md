# TONE_Page 个人博客

## 简介
一款由NextJS+NustJS(+Postgres)打造的现代化个人博客平台

## 功能特性
- 资源/工具发布
- 博客发布
- 博客评论及回复
- 用户系统（支持账号密码登录、邮箱验证码登录）

## 安装与运行
```bash
git clone https://git.tonesc.cn/tone/tonePage.git

# 后端
cd tone-page-server
touch .env # 创建并编辑环境变量，需要包含以下信息
npm run build
npm run start:prod

# 前端
cd tone-page-web
npm run build
npm run start
```

```bash
# 后端环境变量
DATABASE_HOST= # 数据库地址（Postgres）
DATABASE_PORT= # 数据库端口
DATABASE_NAME= # 数据库名称
DATABASE_USERNAME= # 数据库用户名
DATABASE_PASSWORD= # 数据库密码
JWT_SECRET= # JWT密钥，任意均可
JWT_EXPIRES_IN= # JWT过期时间，例如1d、12h
ALIYUN_ACCESS_KEY_ID= # 阿里云RAM用户ACCESS_KEY_ID
ALIYUN_ACCESS_KEY_SECRET= # 阿里云RAM用户ACCESS_KEY_SECRET
ALIYUN_OSS_STS_ROLE_ARN= # 阿里云OSS_STS需要扮演的角色ARN
NODE_ENV=production # 保留该行表示在生产环境
```
## 注意事项
* 注意后端在正式进入生产环境前，需要先注释```NODE_ENV=production```以实现数据表结构初始化，完成后重启服务，并取消注释即可正式进入生产环境
* 若需使用pm2进行服务管理，可通过```pm2 start "npm run start" --name "name"```启动
* 前端服务开放在3002端口，后端服务开放在3001端口

## 许可证
MIT