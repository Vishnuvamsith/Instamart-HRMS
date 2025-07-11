const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand ,GetCommand, UpdateCommand, QueryCommand,BatchWriteCommand} = require('@aws-sdk/lib-dynamodb');
// const { fromSSO} = require('@aws-sdk/credential-providers');
// const { fromEnv } = require('@aws-sdk/credential-provider-env');
require('dotenv').config();

class Dynamodbmanager
{
    constructor(region="ap-southeast-1")
    {
        this.region=region,
        // this.profile=profile
        this.client=new DynamoDBClient(
            {
            region:this.region
            // credentials:async()=>
            // {
            //     try
            //     {
            //         return await fromSSO({profile:this.profile})()
            //     }
            //     catch(err)
            //     {
            //         return await fromEnv()()
            //     }
            // }

        }
    )
        this.docclient=DynamoDBDocumentClient.from(this.client)
    }
    getdocclient()
    {
        return this.docclient
    }
    async putItem(params)
    {
        try
        {
            const command=new PutCommand(params)
            return await this.docclient.send(command)
        }
        catch(err)
        {
            throw err
        }
    }
    async getItem(params)
    {
        try
        {
            const commad=new GetCommand(params)
            return await this.docclient.send(commad)
        }
        catch(err)
        {
            throw err
        }
    }
    async updateItem(params)
    {
        try
        {
            const command=new UpdateCommand(params)
            return await this.docclient.send(command)
        }
        catch(err)
        {
            throw err
        }
    }
    async queryItem(params)
    {
        try
        {
            const command=new QueryCommand(params)
            return await this.docclient.send(command)
        }
        catch(err)
        {
            throw err
        }
    }
    async batchWrite(params)
    {
        try
        {
            const command=new BatchWriteCommand({RequestItems:params.RequestItems})
            return await this.docclient.send(command)
        }
        catch(err)
        {
            throw err
        }
    }

}
module.exports=Dynamodbmanager