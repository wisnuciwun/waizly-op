FROM public.ecr.aws/docker/library/node:18.19.0-alpine
RUN apk --no-cache add tzdata \
    && cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime \
    && echo "Asia/Jakarta" > /etc/timezone
    
WORKDIR /opt/
COPY    . .
RUN apk update && apk add curl xsel
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]