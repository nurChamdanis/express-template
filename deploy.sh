#!/bin/bash
# TBD
# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

echo "CI? [$CI]"

if [ ! $1 ]; then # environment eg. uat
  echo "Missing project environment. Set at package.json. Press any key to continue..."
  if [ "$CI" != "true" ]; then
    read
  fi
  exit
fi

if [ "$1" = "development" ]; then
  echo "Cannot deploy using development environment. Press any key to continue..."
  if [ "$CI" != "true" ]; then
    read
  fi
  exit
fi

echo Deploying To Google Cloud Run $1

BUILD_TS=`date +"%Y%m%d%H%M"`
echo "build_ts $BUILD_TS"

if [ "$CI" = "true" ]; then
  echo "CI deploy"
  echo "configured gcloud auth for $GCP_PROJECT_ID $APP_NAME"
  # get current timestamp...
  # gcloud auth list
else
  echo "manual deploy"
  GCP_PROJECT_ID=mybot-live
  APP_NAME=sample-app
  # vault
  VAULT=
  gcloud auth activate-service-account --key-file=apps/deploy/$1.gcp.json
  gcloud config set project $GCP_PROJECT_ID
fi

# a test run
# cross-env NODE_ENV=development VAULT="$VAULT" PORT=3001 DEBUG=app:* node --ignore '*.test.js' --watch src bin/www
# read && exit

# XXXX="docker build -t gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:$BUILD_TS --target $1 --build-arg ARG_NODE_ENV=$1 --build-arg ARG_API_PORT=3000 ."
# echo $XXXX
# exit

# deploy to cloud run etc...
gcloud auth configure-docker gcr.io
docker build -t gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:$BUILD_TS --target $1 --build-arg ARG_NODE_ENV=$1 --build-arg ARG_API_PORT=3000 . || exit 1001
docker push gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:$BUILD_TS || exit 1002
gcloud run deploy $APP_NAME-$1-svc --image gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:$BUILD_TS --platform managed --region asia-southeast1 --allow-unauthenticated --port=3000

# gcloud run services delete $APP_NAME-$1-svc --platform managed --region asia-east1
# gcloud container images delete gcr.io/cloudrun/helloworld

echo Done...
if [ "$CI" != "true" ]; then
  echo press enter key to exit
  read # pause exit in windows
fi
