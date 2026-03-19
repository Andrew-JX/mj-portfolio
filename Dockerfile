# syntax=docker/dockerfile:1

# --- build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖文件以便利用缓存
COPY package.json package-lock.json ./
RUN npm ci

# 再复制源码并构建
COPY . ./
RUN npm run build

# --- runtime stage ---
FROM nginx:1.27-alpine

# 使用自定义 nginx 配置
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
