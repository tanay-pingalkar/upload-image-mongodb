const express=require('express');
const mongoose=require('mongoose');
const app=express();
const PORT= process.env.PORT || 9000;
const cors=require('cors')
const connection=`mongodb://tanay:Ceww3aFqYEcSmhM@cluster0-shard-00-00.peysn.mongodb.net:27017,cluster0-shard-00-01.peysn.mongodb.net:27017,cluster0-shard-00-02.peysn.mongodb.net:27017/learndb?ssl=true&replicaSet=atlas-vdbv79-shard-0&authSource=admin&retryWrites=true&w=majority`;
const Img =require('./image');
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

const path = require("path");

app.listen(PORT,()=>console.log(`listening on port ${PORT}`));
app.use(cors());
app.use((req,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers',"*");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//* DB config
mongoose.connect(connection, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
},()=>{
    console.log('connected');
});

const multer = require("multer");


var upload = multer();

app.post("/upload", upload.single("file"), async function(req, res, next) {
    const {
      file,
      body: { name }
    } = req;
    var new_img = new Img;
    new_img.img.data = fs.readFileSync(req.file.path)
    new_img.img.contentType = 'image/jpeg';
    const rand=Math.floor(Math.random()*1000000);
    const fileName = rand + file.detectedFileExtension;
    new_img.url=`http://localhost:9000/${fileName}`
    new_img.save()
    
      
    await pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/public/${fileName}`)
    );
    res.send('message is saved, you get fetch it now')

});


app.get("/get",(req,res)=>{
    Img.find({},(err,data)=>{
        res.send(data);
    });
})
app.get("/image", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/lala.jpg"));
  });


app.use(express.static("public"));
