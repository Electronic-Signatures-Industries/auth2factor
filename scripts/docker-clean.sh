#!/bin/bash -eux
PACKAGE_VERSION=$(node -p -e "require('../service/package.json').version")

docker rmi auth2factor/shared:$PACKAGE_VERSION
docker rmi auth2factor/api:$PACKAGE_VERSION
docker rmi auth2factor/ui:$PACKAGE_VERSION

docker rmi us.gcr.io/auth2factor/shared:$PACKAGE_VERSION
docker rmi us.gcr.io/auth2factor/api:$PACKAGE_VERSION
docker rmi us.gcr.io/auth2factor/ui:$PACKAGE_VERSION

docker images