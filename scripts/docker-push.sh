#!/bin/bash -eux
PACKAGE_VERSION=$(node -p -e "require('../service/package.json').version")

docker login -u oauth2accesstoken -p "$(gcloud auth print-access-token)" https://us.gcr.io

gcloud docker -- push us.gcr.io/auth2factor/proxy:$PACKAGE_VERSION
gcloud docker -- push us.gcr.io/auth2factor/api:$PACKAGE_VERSION
gcloud docker -- push us.gcr.io/auth2factor/ui:$PACKAGE_VERSION

