const express = require("express");
const mySQLdb = require("mysql2");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const req = require("express/lib/request");
const app = express();
//Middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


const sequelize= new Sequelize("aviation101","root","root12345", {
    host: "localhost",
    dialect: "mysql"
});

//checking if the connection is established
async function checkSequelizeConnection(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

const testTable= sequelize.define('testTable', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
    lastName: {
        type: DataTypes.STRING
      }
})
const syncTable= async(tableName)=>{
    try{
        await testTable.sync({force:true});
        console.log("The table for the Test model was just (re)created!");
    }catch(err){
        console.log("Error: No table was created");
    }
}

const addData=async(table)=>{
    try{
        const res= await table.create({ firstName: "Shivam", lastName: "Chamoli" });
        console.log("Data Successfully Entered")
    }catch(err){
        console.log(err)
    }
    
}


app.get("/test", (req,res)=>{
    res.set('Content-Type', 'text/html');
    res.status(200).send((Buffer.from("<p><h1>Welcome to Aviation 101</h1><p>To use This API use the visit the following <a>link</a></p></p>")))
})


app.get("/tables", async(req,res)=>{
    let table= testTable;
    if((res.body!==undefined) && (res.body.tableName!==undefined || res.body.tableName!==null)) table=res.body.tableName; 
    const allrecords= await table.findAll(); 
    res.status(200).send({tableData: allrecords[0]});
})

app.listen(3000,async()=>{
    console.log("Server Started SuccessFully ==> @Port:3000");
    checkSequelizeConnection();
    await syncTable(testTable);
    addData(testTable);
})