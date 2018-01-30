---
layout: post
title: "Fabric: Updating the Chaincode"
subtitle:  "blockchain"
date:   2018-02-01
categories: javascript, fabric
status: publish
---

# Hyperledger Fabric: Updating the Chaincode

A few links for reference:
* [Initial Todo Network](https://github.com/marek5050/Hyperledger_Todo_App)
* [Hyperledger Fabric: Sample projects](http://hyperledger-fabric.readthedocs.io/en/latest/samples.html)
* [Hyperledger Fabric: Building your first network tutorial](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html)
* [Hyperledger Fabric Glossary](http://hyperledger-fabric.readthedocs.io/en/latest/glossary.html)


After successfully deploying the our network in the [Initial Todo Network](https://github.com/marek5050/Hyperledger_Todo_App)
we can Create new tasks using `node invoke.js`, and Query all tasks `node query.js`. But later on we might actually
want to finish tasks. 

## Adding new functionality to the chaincode

Lets create a v2 of the todo app.
```
./todo_cc/v2
```
Open the Javascript Chaincode in `./todo_cc/todo.js` and add the "finishTask" function. 
The finishTask function will simply query the Task by it's identifier and update the status field to "Finished". 

```javascript
async finishTask(stub, args){
        console.info("============= START : Finish Task ===========");
        if (args.length != 1){
            throw new Error("Incorrect number of arguments. Expecting 1");
        }

        let taskAsBytes = await stub.getState(args[0]);
        let task = JSON.parse(taskAsBytes);
        task.status="Finished";

        await stub.putState(args[0], Buffer.from(JSON.stringify(task)));
        console.info("============= END : Finish Task ===========");
    }
```


## Changing the client code
On the client side we just want to call the remote function called **finishTask**.
Since there's plenty of boilerplate code already in **[invoke.js](https://github.com/marek5050/Hyperledger_Todo_App/blob/master/todo/invoke.js)** we can just copy and paste the file and let's call it **finish.js**.
Modify the **finish.js** file by changing  the request to include the new function name **finishTask**
```javascript 
	var request = {
		//targets: let default to the peer assigned to the client
        chaincodeId: 'todo',
        fcn: 'finishTask',
        args: ['TASK3'],
		chainId: 'mychannel',
		txId: tx_id
	};
```

okay! Tumpadatara! play the tramboune and run the script! 

``` 
$ node ./todo/finish.js
> Successfully loaded user1 from persistence
> Assigning transaction_id:  0158647a07975091828a00a12d9f653a9de3066cf0cc41b1a0abcf640740fd9e
> error: [client-utils.js]: sendPeersProposal - Promise is rejected: Error: 2 UNKNOWN: error executing chaincode: failed to execute transaction: timeout expired while executing transaction
Transaction proposal was bad
Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...
Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...
```
okay, that failed... why? Let's review the logs.

```bash
$ docker logs -f a22342d84768

{ fcn: 'finishTask', params: [ 'TASK3' ] }
no function if name: finishTask found
(node:18) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 2): Error: Received unknown function finishTask invocation
(node:18) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```


No function found. We only updated the chaincode locally, we'll actually have the network **peer**. Each **peer** runs
it's own version of the chaincode and just because we updated locally doesn't mean they'll be running the most up to date version.


## Deploying the chaincode...
Assuming we have the network from part 1 still running. 
```bash
$ docker ps 

CONTAINER ID        IMAGE                                                                                                  COMMAND                  CREATED             STATUS              PORTS                                            NAMES
a22342d84768        dev-peer0.org1.example.com-todo-1.0-b8c741e976735e8f9a93e869d70ca56bfe59690d5be5019faa3d26ab7889a1ec   "/bin/sh -c 'cd /u..."   21 hours ago        Up 21 hours                                                          dev-peer0.org1.example.com-todo-1.0
211c723d95c4        hyperledger/fabric-tools                                                                               "/bin/bash"              21 hours ago        Up 21 hours                                                          cli
d5f432b4a068        hyperledger/fabric-peer                                                                                "peer node start"        21 hours ago        Up 21 hours         0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer0.org1.example.com
f2314d5a9669        hyperledger/fabric-ca                                                                                  "sh -c 'fabric-ca-..."   21 hours ago        Up 21 hours         0.0.0.0:7054->7054/tcp                           ca.example.com
16910d44b25f        hyperledger/fabric-couchdb                                                                             "tini -- /docker-e..."   21 hours ago        Up 21 hours         4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb
4c68506a2ef4        hyperledger/fabric-orderer                                                                             "orderer"                21 hours ago        Up 21 hours         0.0.0.0:7050->7050/tcp                           orderer.example.com
```

We would just like to "upgrade" the peer's chaincode. It's like upgrading a running application, how hard can it be...

### Step 0. Entering the peer 
First we need to enter the *peer*. 
```bash 
$ docker exec -i -t cli /bin/bash  
$ cd /root/todo_cc/
$ ls 
hyperledger  package.json  todo.js  v2
$ cd v2
```

### Step 1. Installing the new chaincode
Once we are in the peer and found the location of the new chaincode we need to install it. 
```bash 
$ peer chaincode install -p `pwd` -n todo  -v 2.0 -l node
2018-01-30 19:02:52.850 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-01-30 19:02:52.850 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-01-30 19:02:52.851 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2018-01-30 19:02:52.851 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2018-01-30 19:02:52.851 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2018-01-30 19:02:52.853 UTC [node-platform] GetDeploymentPayload -> DEBU 006 Packaging node.js project from path /root/todo_cc/v2
2018-01-30 19:02:52.853 UTC [container] WriteFolderToTarPackage -> INFO 007 rootDirectory = /root/todo_cc/v2
2018-01-30 19:02:52.863 UTC [container] func1 -> DEBU 008 Writing file src/package.json to tar
2018-01-30 19:02:52.866 UTC [container] func1 -> DEBU 009 Writing file src/todo.js to tar
2018-01-30 19:02:52.869 UTC [container] func1 -> DEBU 00a Writing file src/v2/package.json to tar
2018-01-30 19:02:52.871 UTC [container] func1 -> DEBU 00b Writing file src/v2/todo.js to tar
2018-01-30 19:02:52.872 UTC [msp/identity] Sign -> DEBU 00c Sign: plaintext: 0A9C070A5C08031A0C08DC82C3D30510...2999FC130000FFFF049E4B1D00320000 
2018-01-30 19:02:52.872 UTC [msp/identity] Sign -> DEBU 00d Sign: digest: 519B7B2E2986A37687045AD0740818FD4B1BBAE4DEBFA741512EFB8338EA966B 
2018-01-30 19:02:52.879 UTC [chaincodeCmd] install -> DEBU 00e Installed remotely response:<status:200 payload:"OK" > 
2018-01-30 19:02:52.879 UTC [main] main -> INFO 00f Exiting.....

$ peer chaincode list --installed
Get installed chaincodes on peer:
name:"todo" version:"1.0" path:"/root/todo_cc" 
name:"todo" version:"2.0" path:"/root/todo_cc/v2" 
2018-01-30 19:03:13.034 UTC [main] main -> INFO 005 Exiting.....
```

Now we can see both versions of the chaincode. 

### Step 2. Upgrading the chaincode
Once the **peer** is aware of both versions we can notify it to **upgrade** from V1.0 to V2.0.
 
```bash 
$ peer chaincode upgrade -C mychannel -l node -n todo -v 4.0 -c '{"Args":["a","10"]}'
 ```
 There will be a lot of output and the process will take about 30 seconds. 
 
 ```bash
 .... 
 2018-01-30 19:06:24.046 UTC [msp] Setup -> DEBU 02c MSP manager setup complete, setup 2 msps
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 02d Proposed new policy Admins for Channel/Application/Org1MSP
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 02e Proposed new policy Readers for Channel/Application/Org1MSP
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 02f Proposed new policy Writers for Channel/Application/Org1MSP
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 030 Proposed new policy Readers for Channel/Application
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 031 Proposed new policy Admins for Channel/Application
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 032 Proposed new policy Writers for Channel/Application
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 033 Proposed new policy Readers for Channel/Orderer/OrdererOrg
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 034 Proposed new policy Writers for Channel/Orderer/OrdererOrg
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 035 Proposed new policy Admins for Channel/Orderer/OrdererOrg
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 036 Proposed new policy Admins for Channel/Orderer
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 037 Proposed new policy BlockValidation for Channel/Orderer
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 038 Proposed new policy Readers for Channel/Orderer
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 039 Proposed new policy Writers for Channel/Orderer
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 03a Proposed new policy Readers for Channel
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 03b Proposed new policy Writers for Channel
 2018-01-30 19:06:24.046 UTC [policies] NewManagerImpl -> DEBU 03c Proposed new policy Admins for Channel
 2018-01-30 19:06:24.047 UTC [common/configtx] addToMap -> DEBU 03d Adding to config map: [Groups] /Channel
 2018-01-30 19:06:24.047 UTC [common/configtx] addToMap -> DEBU 03e Adding to config map: [Groups] /Channel/Application
 2018-01-30 19:06:24.047 UTC [common/configtx] addToMap -> DEBU 03f Adding to config map: [Groups] /Channel/Application/Org1MSP
 2018-01-30 19:06:24.047 UTC [common/configtx] addToMap -> DEBU 040 Adding to config map: [Values] /Channel/Application/Org1MSP/MSP
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 041 Adding to config map: [Policy] /Channel/Application/Org1MSP/Readers
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 042 Adding to config map: [Policy] /Channel/Application/Org1MSP/Writers
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 043 Adding to config map: [Policy] /Channel/Application/Org1MSP/Admins
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 044 Adding to config map: [Policy] /Channel/Application/Readers
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 045 Adding to config map: [Policy] /Channel/Application/Admins
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 046 Adding to config map: [Policy] /Channel/Application/Writers
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 047 Adding to config map: [Groups] /Channel/Orderer
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 048 Adding to config map: [Groups] /Channel/Orderer/OrdererOrg
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 049 Adding to config map: [Values] /Channel/Orderer/OrdererOrg/MSP
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 04a Adding to config map: [Policy] /Channel/Orderer/OrdererOrg/Admins
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 04b Adding to config map: [Policy] /Channel/Orderer/OrdererOrg/Readers
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 04c Adding to config map: [Policy] /Channel/Orderer/OrdererOrg/Writers
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 04d Adding to config map: [Values] /Channel/Orderer/BatchSize
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 04e Adding to config map: [Values] /Channel/Orderer/BatchTimeout
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 04f Adding to config map: [Values] /Channel/Orderer/ChannelRestrictions
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 050 Adding to config map: [Values] /Channel/Orderer/ConsensusType
 2018-01-30 19:06:24.048 UTC [common/configtx] addToMap -> DEBU 051 Adding to config map: [Policy] /Channel/Orderer/BlockValidation
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 052 Adding to config map: [Policy] /Channel/Orderer/Readers
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 053 Adding to config map: [Policy] /Channel/Orderer/Writers
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 054 Adding to config map: [Policy] /Channel/Orderer/Admins
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 055 Adding to config map: [Values] /Channel/OrdererAddresses
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 056 Adding to config map: [Values] /Channel/HashingAlgorithm
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 057 Adding to config map: [Values] /Channel/Consortium
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 058 Adding to config map: [Values] /Channel/BlockDataHashingStructure
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 059 Adding to config map: [Policy] /Channel/Admins
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 05a Adding to config map: [Policy] /Channel/Readers
 2018-01-30 19:06:24.049 UTC [common/configtx] addToMap -> DEBU 05b Adding to config map: [Policy] /Channel/Writers
 2018-01-30 19:06:24.049 UTC [chaincodeCmd] InitCmdFactory -> INFO 05c Get chain(mychannel) orderer endpoint: orderer.example.com:7050
 2018-01-30 19:06:24.050 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 05d Using default escc
 2018-01-30 19:06:24.050 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 05e Using default vscc
 2018-01-30 19:06:24.050 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 05f java chaincode disabled
 2018-01-30 19:06:24.051 UTC [chaincodeCmd] upgrade -> DEBU 060 Get upgrade proposal for chaincode <name:"todo" version:"2.0" >
 2018-01-30 19:06:24.051 UTC [msp/identity] Sign -> DEBU 061 Sign: plaintext: 0AA6070A6608031A0B08B084C3D30510...31300A000A04657363630A0476736363 
 2018-01-30 19:06:24.051 UTC [msp/identity] Sign -> DEBU 062 Sign: digest: BBDC02BC2D529E3CBE1A50DAD4702D655EB754F77D40478B95D67B84766BEF27
 ```
but eventually we will see this line:
``` 
2018-01-30 19:06:24.051 UTC [chaincodeCmd] upgrade -> DEBU 060 Get upgrade proposal for chaincode <name:"todo" version:"2.0" >
```
which signifies the upgrade was finished. 


## Finishing the task, again
The **peer** chaincode was upgraded so let's try to run the client code again.
```bash 
$ node todo/finish.js 
Successfully loaded user1 from persistence
Assigning transaction_id:  f9a60a4d1548a93955635fce182010688fc5bde61ff10bfb3bd5a263059617c4
Transaction proposal was good
Successfully sent Proposal and received ProposalResponse: Status - 200, message - "OK"
info: [EventHub.js]: _connect - options {"grpc.max_receive_message_length":-1,"grpc.max_send_message_length":-1}
The transaction has been committed on peer localhost:7053
Send transaction promise and event listener promise have completed
Successfully sent transaction to the orderer.
Successfully committed the change to the ledger by the peer
```

## Verify the task was finished
Let's query all tasks just to verify I'm finally done with lunch. 


```bash
$ node todo/query.js 
Successfully loaded user1 from persistence
Query has completed, checking results
Response is  [{"Key":"TASK0","Record":{"docType":"task","owner":"Marek","status":"incomplete","task":"Build a todo app"}},
{"Key":"TASK1","Record":{"docType":"task","owner":"Marek","status":"incomplete","task":"Write a Todo app tutorial"}},
{"Key":"TASK3","Record":{"docType":"task","owner":"Marek","status":"Finished","task":"Grab some lunch"}}]
```
Notice "TASK3" now reflects the status "Finished". 


In part 3 we'll get dirty writing tests.
