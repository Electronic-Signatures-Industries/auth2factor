FROM node:6.11.4-alpine
MAINTAINER "Rogelio Morrell, 2016 - 2018 <info@auth2factor.com>"

ARG package_version

# Create app directory
RUN mkdir -p /usr/src/app/ui 
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /usr/src/app/ui

COPY package.json .
RUN npm install --production
COPY /releases/v$package_version/ui /usr/src/app/ui

EXPOSE 3005 80

# dumb init
ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# RUN groupadd -r nodejs \
#    && useradd -m -r -g nodejs nodejs
# USER nodejs

CMD ["dumb-init", "node", "lib/hapi/index.js"]
