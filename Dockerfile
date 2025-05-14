FROM node:20-alpine as build

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем React-приложение
RUN npm run build

# Финальный образ с Nginx
FROM nginx:alpine

# Копируем собранные файлы из стадии build
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
