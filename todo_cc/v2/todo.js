const shim  = require('fabric-shim');
const util = require('util');

let Chaincode = class {
    async Init(stub){
        console.info("=========== Instantiated todo chaincode ===========");
        return shim.success();
    }

    async Invoke(stub){
        let ret = stub.getFunctionAndParameters();
        console.info(ret);

        let method = this[ret.fcn];

        if (!method){
            console.error("no function if name: " + ret.fcn + " found");
            throw new Error("Received unknown function " + ret.fcn + " invocation");
        }


        try {
            let payload = await method(stub, ret.params);
            return shim.success(payload);
        }catch(err){
            console.log(err);
            return shim.error(err);
        }
    }

    async initLedger(stub, args){
        console.info("============= START : Initialize Ledger ===========");
        let todo = [];
        todo.push({
            task:"Build a todo app",
            owner: "Marek",
            status: "incomplete"
        },{
            task:"Write a Todo app tutorial",
            owner:"Marek",
            status: "incomplete",
        });

        for (let i=0; i <todo.length; i++){
            todo[i].docType = 'task';
            await stub.putState("TASK"+i, Buffer.from(JSON.stringify(todo[i])));
            console.info("Added <--> ", todo[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    async createTask(stub, args){
        console.info("============= START : Create Task ===========");
        if(args.length != 4){
            throw new Error("Incorrect number of arguments. Expecting 4");
        }
        var task = {
            docType: 'task',
            owner: args[1],
            task: args[2],
            status: args[3]
        }

        await stub.putState(args[0], Buffer.from(JSON.stringify(task)));
        console.info("============= END : Create Task ===========");
    }

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

    async queryTask(stub, args){
        console.info("============= START : Query Task ===========");
        if (args.length != 1 ){
            throw new Error("Incorrect number of arguments. Expecting Task ID: TASK01");
        }
        let taskID = args[0];
        let taskAsBytes = await stub.getState(taskID);
        if (!taskAsBytes || taskAsBytes.toString()<=0){
            throw new Error(taskID + " does not exist")
        }
        console.log(taskAsBytes.toString());
        console.info("============= END : Query Task ===========");
        return taskAsBytes;
    }

    async queryAllTasks(stub, args){
        console.info("============= START : Query All Tasks ===========");
        let startKey = 'TASK0';
        let endKey = 'TASK999';

        let iterator = await stub.getStateByRange(startKey,endKey);

        let allResults = [];
        while(true){
            let res = await iterator.next();
            if (res.value && res.value.value.toString()){
                let jsonRes= {};
                console.log(res.value.value.toString('utf8'));
                jsonRes.Key = res.value.key;
                try{
                    jsonRes.Record= JSON.parse(res.value.value.toString('utf8'));

                }catch(err){
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done){
                console.log("end of data");
                await iterator.close();
                console.info(allResults);
                console.info("============= END : Query All Tasks ===========");
                return Buffer.from(JSON.stringify(allResults));
            }
        }
    }

};

shim.start(new Chaincode());