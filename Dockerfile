# Usamos una imagen de nginx
FROM nginx:alpine

# Copiamos el build de Angular al directorio que Nginx sirve
COPY dist/estudio-libre/browser /usr/share/nginx/html

# Copiamos una configuración custom de nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80 para el servidor web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
