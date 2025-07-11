const dynamodb=require('../service/dynamodbmanager')
const express=require('express')
const router=express.Router()
const db=new dynamodb()
router.post('/additem',async(req,res)=>
{
    const product=req.body
    const params=
    {
        TableName:"dynamotest",
        Item:
        {
            product_id:product.product_id,
            name:product.name,
            engineCapacity:product.capacity,
            seater:product.seats
        }
    }
    const result= await db.putItem(params)
    res.status(200).json({message:"items added sucessfully",data:params.Item})
})
router.post("/fetchitems",async(req,res)=>
{
    const name=req.body.name
    const params=
    {
        TableName:"dynamotest",
        IndexName: "name-index",
        KeyConditionExpression: "#nm = :nameVal",
        ExpressionAttributeNames: {
            "#nm": "name" // Maps #nm to the actual attribute name
        },
        ExpressionAttributeValues: {
            ":nameVal": name
        }
    }
    const result=await db.queryItem(params)
    res.status(200).json({message:"item fetched sucessfully",data:result})
})
module.exports=router
