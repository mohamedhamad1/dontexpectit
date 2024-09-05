require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
mongoose
    .connect(process.env.dburi)
    .then(()=>{console.log('db connect successfully');})
    .catch((err)=>{console.log(err);})
const Flag = require('./model')
const bodyparser = require('body-parser');
const { name } = require('ejs');
const app = express()

app.set('view engine', 'ejs')
app.use(bodyparser.json())
app.use(express.static('public'))

app.get('/',(req, res)=>{
    res.render('home')
    console.log(`GET ${req.url}\n${JSON.stringify(req.body)}\n`);
    
})
app.post('/',async(req, res)=>{
    const farmerStatus = req.body.farmerStatus
    console.log(`POST ${req.url}\n${JSON.stringify(req.body)}\n`);
    if(farmerStatus === 'full'){
        res.json({message:'GREAT!!!',color:'green'})
    }else if(farmerStatus === 'half'){
        res.json({message:'WE WILL SEE IT',color:'red'})
    }else{
        const output = await Flag.findOne({flag:farmerStatus})
        if(!output){
            res.status(400).json({message:`Invalid farmerStatus: "${farmerStatus}" ... MONGO CAN'T HANDLE IT`})
        }else{
            res.status(200).json(output)
        }
    }
})
app.get('/evil',(req,res)=>{
    console.log(`GET ${req.url}\n${JSON.stringify(req.body)}\n`);
    const token = req.query.token || []
    const isAuth = token[0] == "dGhpcyBpcyBteSBmbGFnIHRva2VuIHRvIHZhbGlkYXRlIHVzZXIgYXV0aG9yaXphdGlvbg=="
    if(isAuth){
        res.status(200).render("evil",{flag:"Farmer{0oh Br0, U aRe R3al Farmer}"})
    }else{
        res.status(403).render("evil",{flag:"Code:403 Forbidden, you are unauthorized to rech that"})
    }
})
app.get('/memo',(req, res)=>{
    res.sendFile(`${__dirname}/public/memo.png`)
})

app.all('*',(req, res)=>{    
    res.status(404).send('<h1>Congratulation you found the FLAG...<br>Hhhh Sorry i kidding you, 404 PageNotFound<br>Go to where you came \.\')</h1>')
})

 
app.listen(6001||process.env.port, ()=>{
    console.log(`server run on http://localhost:${process.env.port}/`);
})