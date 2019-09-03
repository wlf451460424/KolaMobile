# production stage
FROM hub.mc.corp/library/nginx:stable-alpine
ARG source
WORKDIR /app
COPY ${source:-dist} /usr/share/nginx/html
COPY ${source:-buildreport} .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]