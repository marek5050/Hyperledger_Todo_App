---
layout: post
title: "Hyperledger Fabric - Getting Started"
subtitle:  "Deploying the genesis block."
date:   2018-01-29
categories: fabric, blockchain
status: publish
---

# Why Hyperledger Fabric?
A few links for reference:
* [Khan Academy "What is Bitcoin"](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-what-is-it)
* [TED Blockchain explained](https://www.youtube.com/watch?v=k53LUZxUF50)
* [Hyperledger Fabric, Ethereum, and Corda compared](https://medium.com/@philippsandner/comparison-of-ethereum-hyperledger-fabric-and-corda-21c1bb9442f6)

Over the last couple of years many of us witnessed the explosion in crypto-currencies from just a few pennies per Bitcoin to
the extraordinary amount it might be at the time of this reading. While Bitcoin is a currency that can be traded all transactions
are logged in something called a **Blockchain**. There are a few **Blockchain** technologies and one of them
happens to be **Hyperledger Fabric**. When I first started the documentation was pretty scarce and most of it didn't work. The following
series is meant to help developers get started developing with Hyperledger Fabric.



A few links to get started with Hyperledger Fabric:
* [Hyperledger Fabric: Sample projects](http://hyperledger-fabric.readthedocs.io/en/latest/samples.html)
* [Hyperledger Fabric: Building your first network tutorial](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html)
* [Hyperledger Fabric Glossary](http://hyperledger-fabric.readthedocs.io/en/latest/glossary.html)
* [Todo App](https://github.com/marek5050/Hyperledger_Todo_App)

The above guides are very well put together and require little additional configuration.

# Building a Todo Application
The guide assumes you've followed the [Hyperledger Fabric: Building your first network tutorial](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html).
The above tutorial will also help configure the environment and deploying an initial network.

Clone the Todo App
```bash
$ git clone https://github.com/marek5050/Hyperledger_Todo_App
cd Hyperledger_Todo_App
```

Notice the components
```
todo
todo_cc
basic-network
```

Hyperledger Fabric is divided into a few pieces, one will be the network architecture(./basic-network), chaincode (./todo_cc), and client code (./todo).
The basic network architecture can remain the same for most projects and I just borrowed the above from the Hyperledge sample projects.

To deploy the network we execute

```
$ ./todo/startFabric.sh node
Starting Node CC

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down
Removing network net_basic
WARNING: Network net_basic not found.

docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb
Creating network "net_basic" with the default driver
Creating couchdb ...
Creating orderer.example.com ...
Creating ca.example.com ...
Creating orderer.example.com
Creating ca.example.com
Creating couchdb ... done
Creating peer0.org1.example.com ...
Creating peer0.org1.example.com ... done

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
2018-01-29 21:36:53.294 UTC [channelCmd] InitCmdFactory -> INFO 001 Endorser and orderer connections initialized
2018-01-29 21:36:53.340 UTC [channelCmd] InitCmdFactory -> INFO 002 Endorser and orderer connections initialized
2018-01-29 21:36:53.544 UTC [main] main -> INFO 003 Exiting.....
# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b mychannel.block
2018-01-29 21:36:53.698 UTC [channelCmd] InitCmdFactory -> INFO 001 Endorser and orderer connections initialized
2018-01-29 21:36:53.855 UTC [channelCmd] executeJoin -> INFO 002 Peer joined the channel!
2018-01-29 21:36:53.855 UTC [main] main -> INFO 003 Exiting.....
Creating cli ...
Creating cli ... done
2018-01-29 21:36:55.763 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-01-29 21:36:55.763 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-01-29 21:36:55.763 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2018-01-29 21:36:55.763 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2018-01-29 21:36:55.763 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2018-01-29 21:36:55.764 UTC [node-platform] GetDeploymentPayload -> DEBU 006 Packaging node.js project from path /root/todo_cc
2018-01-29 21:36:55.764 UTC [container] WriteFolderToTarPackage -> INFO 007 rootDirectory = /root/todo_cc
2018-01-29 21:36:55.780 UTC [container] func1 -> DEBU 008 Writing file src/package.json to tar
2018-01-29 21:36:55.783 UTC [container] func1 -> DEBU 009 Writing file src/todo.js to tar
2018-01-29 21:36:55.784 UTC [msp/identity] Sign -> DEBU 00a Sign: plaintext: 0A9C070A5C08031A0C08F7A7BED30510...3F93FD110000FFFFB465810C001A0000
2018-01-29 21:36:55.784 UTC [msp/identity] Sign -> DEBU 00b Sign: digest: D56DD56CC514212EC890865CE4FCD168822B7C27059E3B5386400C398EE0944A
2018-01-29 21:36:55.787 UTC [chaincodeCmd] install -> DEBU 00c Installed remotely response:<status:200 payload:"OK" >
2018-01-29 21:36:55.787 UTC [main] main -> INFO 00d Exiting.....
2018-01-29 21:36:55.963 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-01-29 21:36:55.963 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-01-29 21:36:55.965 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2018-01-29 21:36:55.965 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2018-01-29 21:36:55.965 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2018-01-29 21:36:55.965 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AA7070A6708031A0C08F7A7BED30510...324D53500A04657363630A0476736363
2018-01-29 21:36:55.965 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: F1B62C4A2E3D7F21F2A65463B0A811342311F4C276B33197A2421DC4BB2986BB
2018-01-29 21:37:22.851 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AA7070A6708031A0C08F7A7BED30510...0D078EA6F9A2B3A08EA79188F36E8B3E
2018-01-29 21:37:22.851 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: 2679B2B48CD86983A9AEDCBC5383C8E77FC2BB667BA19ECE5DF9260E68C90A0E
2018-01-29 21:37:22.854 UTC [main] main -> INFO 00a Exiting.....
2018-01-29 21:37:33.010 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-01-29 21:37:33.010 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-01-29 21:37:33.011 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2018-01-29 21:37:33.011 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2018-01-29 21:37:33.011 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2018-01-29 21:37:33.011 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AA6070A6608031A0B089DA8BED30510...1A0E0A0A696E69744C65646765720A00
2018-01-29 21:37:33.011 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: 9F8A3D26377707B1BD70EFB76E078C37A7050BDB5AF911CF31D7FBFA204FD5B0
2018-01-29 21:37:33.024 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AA6070A6608031A0B089DA8BED30510...687E6EEE2E2D822292300CCB3F6E2465
2018-01-29 21:37:33.024 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: 0705EEA800EAF17B9A0BEA33146D1B83A489EA1D6D44075D8C7B891682137473
2018-01-29 21:37:33.026 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> DEBU 00a ESCC invoke result: version:1 response:<status:200 message:"OK" > payload:"\n \250\006\256T\375\250\223\236\315\356\026\203\370\232\270\326\340\362\2440*^vLT\215\275M7T/\262\022\372\001\n\345\001\022\024\n\004lscc\022\014\n\n\n\004todo\022\002\010\001\022\314\001\n\004todo\022\303\001\032[\n\005TASK0\032R{\"task\":\"Build a todo app\",\"owner\":\"Marek\",\"status\":\"incomplete\",\"docType\":\"task\"}\032d\n\005TASK1\032[{\"task\":\"Write a Todo app tutorial\",\"owner\":\"Marek\",\"status\":\"incomplete\",\"docType\":\"task\"}\032\003\010\310\001\"\013\022\004todo\032\0031.0" endorsement:<endorser:"\n\007Org1MSP\022\226\006-----BEGIN CERTIFICATE-----\nMIICGjCCAcCgAwIBAgIRAPlwF/rUZUP9mqN4wSml4iswCgYIKoZIzj0EAwIwczEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMTcwODMxMDkxNDMyWhcNMjcwODI5MDkxNDMy\nWjBbMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMN\nU2FuIEZyYW5jaXNjbzEfMB0GA1UEAxMWcGVlcjAub3JnMS5leGFtcGxlLmNvbTBZ\nMBMGByqGSM49AgEGCCqGSM49AwEHA0IABHihxW6ks3B2+5XdbAVq3CBgxRRRZ22x\nzzpqnD86nKkz7fBElBuhlXl2K6rTxyY2OBOB0ts8keqZ93xueRGymrajTTBLMA4G\nA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIEI5qg3Ndtru\nuLoM2nAYUdFFBNMarRst3dusalc2Xkl8MAoGCCqGSM49BAMCA0gAMEUCIQD4j0Rn\ne1rrd0FSCzsR6u+IuuPK5dI/kR/bh7+VLf0TNgIgCfUtkJvfvzVEwZLFoFyjoHtr\ntvwzNUS1U0hEqIaDeo4=\n-----END CERTIFICATE-----\n" signature:"0E\002!\000\253#\010\366\207\316Y\325bL\007/\2540\235h M$\004]\346\331\200qz\223\340c\363\376*\002 1\320d\257{r\007\232\304\2029nH7\020Bh~n\356.-\202\"\2220\014\313?n$e" >
2018-01-29 21:37:33.026 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 00b Chaincode invoke successful. result: status:200
2018-01-29 21:37:33.026 UTC [main] main -> INFO 00c Exiting.....

Total setup execution time : 55 secs ...


Start by installing required packages run 'npm install'
Then run 'node enrollAdmin.js', then 'node registerUser'

The 'node invoke.js' will fail until it has been updated with valid arguments
The 'node query.js' may be run at anytime once the user has been registered

```
**Warning: execution might stall for about a minute, it's not frozen.. just let it work..**


This will download the appropriate docker containers, create the security keys, run a ordered, and whatever
other magic needs to happen.

```
$ docker ps
CONTAINER ID        IMAGE                                                                                                  COMMAND                  CREATED             STATUS              PORTS                                            NAMES
82c0b5f176b6        dev-peer0.org1.example.com-todo-1.0-b8c741e976735e8f9a93e869d70ca56bfe59690d5be5019faa3d26ab7889a1ec   "/bin/sh -c 'cd /u..."   29 minutes ago      Up 29 minutes                                                        dev-peer0.org1.example.com-todo-1.0
818bc8f87561        hyperledger/fabric-tools                                                                               "/bin/bash"              29 minutes ago      Up 29 minutes                                                        cli
86855fb78c61        hyperledger/fabric-peer                                                                                "peer node start"        30 minutes ago      Up 29 minutes       0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer0.org1.example.com
6def8ee0c4fa        hyperledger/fabric-ca                                                                                  "sh -c 'fabric-ca-..."   30 minutes ago      Up 29 minutes       0.0.0.0:7054->7054/tcp                           ca.example.com
9f3dd14ac3ae        hyperledger/fabric-couchdb                                                                             "tini -- /docker-e..."   30 minutes ago      Up 29 minutes       4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb
181e1b8a0e9f        hyperledger/fabric-orderer                                                                             "orderer"                30 minutes ago      Up 29 minutes       0.0.0.0:7050->7050/tcp                           orderer.example.com
```

The **chaincode** will be running on **dev-peer0.org1.example.com**
to see the logs in a seperate terminal we can
```bash
$ docker logs -f 82c0b5f176b6
```
**82c0b5f176b6 is dev-peer0.org1.example.com from above**


## Interacting with the Blockchain...

After deploying the network we might want to interact with the blockchain. There are two components
the **chaincode** which runs inside the network and **client code** which we use to interact with the **chaincode**.
But Hyperledger Fabric also has a security component that we need to take care of first.

We'll need enroll an Admin and register a User, thank goodness these are simple scripts.

```bash
$ node enrollAdmin.js
Successfully enrolled admin user "admin"
Assigned the admin user to the fabric client ::{"name":"admin","mspid":"Org1MSP","roles":null,"affiliation":"","enrollmentSecret":"","enrollment":{"signingIdentity":"ad3a89fa1cd1f35cd7100cc750c0c6504c5d0bf4413694d2d29696314d9f2210","identity":{"certificate":"-----BEGIN CERTIFICATE-----\nMIIB8TCCAZegAwIBAgIUDOWlyfzL2mk9C6/R3uTRVhJgeYkwCgYIKoZIzj0EAwIw\nczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT\nE2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTgwMTI5MTk1MzAwWhcNMTkwMTI5MTk1\nMzAwWjAQMQ4wDAYDVQQDEwVhZG1pbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IA\nBF+xOS1Ek7W4WsZjrnNjBN+/FVJyH2NiPpDQAtMz4fuBH5Zk0KYRccVTMOGk1O6U\nKuEvjhSCaxuqzV4ulyKt83yjbDBqMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8E\nAjAAMB0GA1UdDgQWBBTASn1tiYGHAymunIXTjVzRiCX1XzArBgNVHSMEJDAigCBC\nOaoNzXba7ri6DNpwGFHRRQTTGq0bLd3brGpXNl5JfDAKBggqhkjOPQQDAgNIADBF\nAiEAqcHZMJl4AXVGw+Upg5Qi2XhehVqc3SOhPviK6JuWMmoCIGNMt9XIlvvlauyq\n/9ixYP2qRH0Nr/CBhst+SqH6ee7A\n-----END CERTIFICATE-----\n"}}}

$ node registerUser.js
Successfully loaded admin from persistence
Successfully registered user1 - secret:WWuPkzLUpzKB
Successfully enrolled member user "user1"
User1 was successfully registered and enrolled and is ready to intreact with the fabric network
```

Now once we have a user registered we can finally interact with the blockchain.

Let's query a few tasks my boss gave me:

```
$ node query.js
Successfully loaded user1 from persistence
Query has completed, checking results
Response is  [{"Key":"TASK0","Record":{"docType":"task","owner":"Marek","status":"incomplete","task":"Build a todo app"}},
{"Key":"TASK1","Record":{"docType":"task","owner":"Marek","status":"incomplete","task":"Write a Todo app tutorial"}}]
```

Great! I can't believe there's already so much todo!

I'm hungry let's add something realistic into the blockchain.

```
$ node invoke.js
Successfully loaded user1 from persistence
Assigning transaction_id:  8c6116681339d90718aa9bbb39885220ae8bd1bbb445416272d356a1d4cf2008
Transaction proposal was good
Successfully sent Proposal and received ProposalResponse: Status - 200, message - "OK"
info: [EventHub.js]: _connect - options {"grpc.max_receive_message_length":-1,"grpc.max_send_message_length":-1}
The transaction has been committed on peer localhost:7053
Send transaction promise and event listener promise have completed
Successfully sent transaction to the orderer.
Successfully committed the change to the ledger by the peer
```

and let's retrieve all the tasks again.
```bash
Successfully loaded user1 from persistence
Query has completed, checking results
Response is  [{"Key":"TASK0","Record":{"docType":"task","owner":"Marek","status":"incomplete","task":"Build a todo app"}},
{"Key":"TASK1","Record":{"docType":"task","owner":"Marek","status":"incomplete","task":"Write a Todo app tutorial"}},
{"Key":"TASK3","Record":{"docType":"task","owner":"Marek","status":"incomplete","task":"Grab some lunch"}}]
```

Great we added a new task TASK3 - "Grab some lunch".


## WTF did just happen?
Let's do a closer analysis of the code we just executed. Let's visit the **query.js** file.
The code starts off with some template security code
```javascript
Fabric_Client.newDefaultKeyValueStore(blah)...
.then((user_from_store) => {

	const request = {
		//targets : --- letting this default to the peers assigned to the channel
		chaincodeId: 'todo',
		fcn: 'queryAllTasks',
		args: []
	};

    return channel.queryByChaincode(request);
}
```

The most important piece here is the composition of the request variable. Notice we are passing
the name of a function `queryAllTasks` and using the queryByChaincode to execute it.

Similarly if we inspect the **invoke.js** file we'll find
```
	var request = {
        chaincodeId: 'todo',
        fcn: 'createTask',
        args: ['TASK3','Marek','Grab some lunch','incomplete'],
		chainId: 'mychannel',
		txId: tx_id
	};

	// send the transaction proposal to the peers
	return channel.sendTransactionProposal(request);
```

In the above we can see the function called `createTask`. The idea is very similar to RPC (remote procedure calls).
We create a channel and pass the function and a few parameters to it, the remote listening server will
then find the function and execute it. But where do `createTask` and `queryAllTasks` reside?


## Oh yea the Chain code!
Enter chain code, the piece of code laying on the blockchain peer. The chain code is responsible for
interacting with the blockchain. Let's inspect the **todo_cc/todo.js**.

```
let Chaincode = class {
    async Init(stub){}
    async Invoke(stub){}
    async initLedger(stub, args){}
    async createTask(stub, args){}
    async queryAllTasks(stub, args){}
    }
shim.start(new Chaincode());
```

So the fabric shim initiates the Chaincode class we defined in the file. The Chaincode class has a few __mandatory__
functions, for example **Invoke**, **Init**, **initLedger**.
Init is called when the Chaincode is initialized on the peer and initLedger is called shortly after.
Invoke is called everytime there's a call from the **client app** along the channel.


See the below output log from this tutorial. Notice the flow of events, Init, initLedger, Query AllTasks, Create Task, Query AllTasks.
```bash
$ docker logs -f 6d00fbb261b7

> todo@1.0.0 start /usr/local/src
> node todo.js "--peer.address" "peer0.org1.example.com:7052"

=========== Instantiated todo chaincode ===========
{ fcn: 'initLedger', params: [ '' ] }
============= START : Initialize Ledger ===========
Added <-->  { task: 'Build a todo app',
  owner: 'Marek',
  status: 'incomplete',
  docType: 'task' }
Added <-->  { task: 'Write a Todo app tutorial',
  owner: 'Marek',
  status: 'incomplete',
  docType: 'task' }
============= END : Initialize Ledger ===========
{ fcn: 'queryAllTasks', params: [] }
============= START : Query All Tasks ===========
{"docType":"task","owner":"Marek","status":"incomplete","task":"Build a todo app"}
{"docType":"task","owner":"Marek","status":"incomplete","task":"Write a Todo app tutorial"}
end of data
[ { Key: 'TASK0',
    Record:
     { docType: 'task',
       owner: 'Marek',
       status: 'incomplete',
       task: 'Build a todo app' } },
  { Key: 'TASK1',
    Record:
     { docType: 'task',
       owner: 'Marek',
       status: 'incomplete',
       task: 'Write a Todo app tutorial' } } ]
============= END : Query All Tasks ===========
{ fcn: 'createTask',
  params: [ 'TASK3', 'Marek', 'Grab some lunch', 'incomplete' ] }
============= START : Create Task ===========
============= END : Create Task ===========
{ fcn: 'queryAllTasks', params: [] }
============= START : Query All Tasks ===========
{"docType":"task","owner":"Marek","status":"incomplete","task":"Build a todo app"}
{"docType":"task","owner":"Marek","status":"incomplete","task":"Write a Todo app tutorial"}
{"docType":"task","owner":"Marek","status":"incomplete","task":"Grab some lunch"}
end of data
[ { Key: 'TASK0',
    Record:
     { docType: 'task',
       owner: 'Marek',
       status: 'incomplete',
       task: 'Build a todo app' } },
  { Key: 'TASK1',
    Record:
     { docType: 'task',
       owner: 'Marek',
       status: 'incomplete',
       task: 'Write a Todo app tutorial' } },
  { Key: 'TASK3',
    Record:
     { docType: 'task',
       owner: 'Marek',
       status: 'incomplete',
       task: 'Grab some lunch' } } ]
============= END : Query All Tasks ===========
```


## Bring it down!
I don't have a nice script to bring down the whole network yet, but in the mean time we just run the below.
This will remove the docker containers, kill the network, and remove and todo app docker images.

```
#!/usr/bin/env bash
docker rm -f $(docker ps -aq)
docker network prune -f
docker rmi dev-peer0.org1.example.com-todo-1.0-b8c741e976735e8f9a93e869d70ca56bfe59690d5be5019faa3d26ab7889a1ec
```

or
```
./todo/stopFabric.sh
```


In part 2 we'll explore how to update the Chaincode.
