FROM nginx:1.13.3

RUN rm /etc/nginx/conf.d/default.conf


COPY app.conf /etc/nginx/nginx.conf
COPY files/h5bp/*.conf /etc/nginx/h5bp/
COPY files/h5bp/directive-only/*.conf /etc/nginx/h5bp/directive-only/ 
COPY files/h5bp/location/*.conf /etc/nginx/h5bp/location/

#RUN mkdir /etc/nginx/ssl
#COPY files/domain.crt /etc/nginx/ssl/domain.crt
#COPY files/domain.key /etc/nginx/ssl/domain.key

EXPOSE 80
EXPOSE 443

# dumb init
ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["dumb-init", "nginx", "-g", "daemon off;"]
