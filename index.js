const express = require("express")
const cors = require("cors")
const cookieParser =  require("cookie-parser")
const Color = require("colors")
const  dbConnect  = require("./config/db")
require("dotenv").config()

const port = process.env.PORT || 3000;
const app = express()

const allowedOrigins = [ 'https://evalwell.vercel.app', 'http://localhost:3000' ];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Support preflight
app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser())
dbConnect()




app.use("/auth",require("./routes/authroute"))
app.use("/eval", require("./routes/evaluationroutes"))
app.use("/auth",(req,res)=>{
    res.json({h:"hello"})
    
})


const serverColor = Color.bold.blue

app.listen(port,()=>{
    console.log(serverColor(`Running on ${port}`))
})