#!/bin/bash -eux
PACKAGE_VERSION=$(node -p -e "require('../service/package.json').version")

docker build -t auth2factor/proxy:$PACKAGE_VERSION ../proxy/nginx
# docker build -t auth2factor/shared:2.6.2 ../shared
docker build -t auth2factor/api:$PACKAGE_VERSION ../service
docker build -t auth2factor/ui:$PACKAGE_VERSION ../ui --build-arg package_version=$PACKAGE_VERSION

docker tag auth2factor/proxy:$PACKAGE_VERSION us.gcr.io/auth2factor/proxy:$PACKAGE_VERSION
docker tag auth2factor/api:$PACKAGE_VERSION us.gcr.io/auth2factor/api:$PACKAGE_VERSION
docker tag auth2factor/ui:$PACKAGE_VERSION us.gcr.io/auth2factor/ui:$PACKAGE_VERSION

docker images
docker images prune
