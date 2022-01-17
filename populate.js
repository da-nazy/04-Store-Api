require('dotenv').config()

const connectDB=require('./db/connect');
const Product=require('./models/product');

const jsonProduct=require('./products.json')


const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        // remove all the product currently in the db
        await Product.deleteMany();

        // dynamic product creation
        await Product.create(jsonProduct);
        console.log("Success!!!")
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(0);
    }
}
start()