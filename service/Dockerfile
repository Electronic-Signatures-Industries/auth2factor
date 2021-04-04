FROM node:6.11.4-alpine
MAINTAINER "Rogelio Morrell, 2016 - 2018 <info@auth2factor.com>"

# Create app directory
RUN mkdir -p /usr/src/app/service 
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /usr/src/app/service

COPY package.json .
RUN npm install --production
COPY . /usr/src/app/service

EXPOSE 80 3002

# dumb init
ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

CMD ["dumb-init", "node", "lib/hapi/index.js"]
