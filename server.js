import express,{json} from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URI = process.env.ATLAS_URI;

mongoose.connect(URI,{
    useNewUrlParser : true,
    useUnifiedTopology: true
},err=>{
    if(err) throw err;
    console.log('Connected to MongoDB Atlas !!!')
})

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())
app.use(passport.initialize());

// For Routing Purpose
import User from './routes/user.js'
import Analyst from './routes/analyst.js'
import Billing from './routes/billing.js'
import Team from './routes/team.js'
// For Routers
app.use('/authentication/user',User);
app.use('/analyst',Analyst);
app.use('/billing',Billing);
app.use('/team',Team);

app.use(express.static(path.join(__dirname , 'client/build')))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname , '/client/build','index.html'));
});

app.listen(port,()=>{
    console.log(`Server Running On Port : ${port}`);
});