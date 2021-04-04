
FROM node:6.11.1-alpine
MAINTAINER "Rogelio Morrell, 2016 - 2017 <info@auth2factor.com>"

# Shared libs 
RUN mkdir -p /usr/src/app/shared/lib
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
COPY lib/license-engine /usr/src/app/shared/lib/license-engine
COPY lib/sender /usr/src/app/shared/lib/sender
COPY lib/tokenizer /usr/src/app/shared/lib/tokenizer
COPY lib/mail-template-compiler /usr/src/app/shared/lib/mail-template-compiler

VOLUME /usr/src/app/shared
