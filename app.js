require('dotenv').config()
// for custom error handling from express
require('express-async-errors')
// async errors

const express=require('express');
const app=express();

const connectDB=require('./db/connect');
const productRouter=require('./routes/products');

const notFoundMiddleware=require('./middleware/not-found');
const errorMiddleware=require('./middleware/error-handler');


// middleware
app.use(express.json());

// routes

app.get('/',(req,res)=>{
  res.send('<h1>Store Api</h1><a href="/api/v1/products">Product route</a>')
})

// routes
app.use('/api/v1/products',productRouter)



//error handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// vid time:4:00:00
// port
const port=process.env.PORT || 3000

const start=async ()=>{
    try{
      // conectDB
      await connectDB(process.env.MONGO_URI)
      app.listen(port, console.log(`Server is listening  port ${port}...`))
    }catch(error){
      console.log(error);
    }
}
start()