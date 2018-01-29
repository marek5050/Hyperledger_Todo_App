#!/usr/bin/env bash
docker rm -f $(docker ps -aq)
docker network prune -f
docker rmi dev-peer0.org1.example.com-todo-1.0-b8c741e976735e8f9a93e869d70ca56bfe59690d5be5019faa3d26ab7889a1ec