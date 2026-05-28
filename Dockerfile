FROM node:22-alpine AS build

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем все зависимости
RUN npm install

# Копируем исходники
COPY . .

# Собираем
RUN npm run build

# Второй этап - nginx
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Настраиваем nginx
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://backend:8000; \
        proxy_set_header Host $host; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]