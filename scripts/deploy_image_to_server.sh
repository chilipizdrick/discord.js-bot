#!/bin/sh

set -e

IMAGE_NAME="chilipizdrick/schizophrenia-bot"
IMAGE_TAG="latest"

SSH_KEY=$1
SERVER_PUBLIC_KEY=$2
SERVER_IP=$3

echo "${SSH_KEY}" | base64 -d > ssh_key
chmod 600 ssh_key

echo "${SERVER_PUBLIC_KEY}" | base64 -d >> ~/.ssh/known_hosts

echo "Deploying via remote SSH"
ssh -i ssh_key "root@${SERVER_IP}" \
  "cd docker-images/ \
  && docker pull ${IMAGE_NAME}:${IMAGE_TAG} \
  && docker stop live-container \
  && docker rm live-container \
  && docker run --init -d --name live-container -p 80:3000 ${IMAGE_NAME}:${IMAGE_TAG} \
  && docker system prune -af"

echo "Successfully deployed!"