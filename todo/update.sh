#!/usr/bin/env bash

cd "/Users/marek.bejda/Desktop/IBM/testing/HyperledgerExample/play/todo_cc"
peer chaincode install -p `pwd` -n todo  -v 4.0 -l node
peer chaincode upgrade -C mychannel -l node -n todo -v 4.0 -c '{"Args":["a","10"]}'
