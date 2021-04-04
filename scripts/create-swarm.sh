#!/bin/bash -eux
PACKAGE_VERSION=$(node -p -e "require('../service/package.json').version")

docker swarm init --advertise-addr 192.168.0.106

docker network create --driver=overlay auth2factor-net

docker service create -e NODE_ENV=production \
-e JWT_SECRET_SESSION=z \
-e API_HOST=auth2factor-api -e API_PORT=80 \
-e FE_PORT=80 -e FE_HOSTNAME=https://localhost  --name auth2factor-ui \
--network auth2factor-net us.gcr.io/auth2factor/ui:$PACKAGE_VERSION

# docker service create --name my-busybox  --network auth2factor-net  busybox   sleep 3000

docker service create --name auth2factor-api -e NODE_ENV=production \
-e JWT_SECRET=TlfIxap9Zu5J53t9Zor5BVJAW1jA1c24 \
-e API_PORT=80 -e FE_HOSTNAME=https://localhost \
-e MONGODB_CONFIG=mongodb://172.19.0.1/auth2factor \
-e MONGOOSE_SECRET=scgY8qL+j0Ni1vJi11Mpnc3z4MD2TwgNd9EqJLiA2ReunyH8jbcM1+w== \
--network auth2factor-net us.gcr.io/auth2factor/api:$PACKAGE_VERSION


docker service create --name proxy --constraint=node.role==manager --publish 8081:80 \
--network auth2factor-net us.gcr.io/auth2factor/proxy:$PACKAGE_VERSION

docker service scale auth2factor-api=3