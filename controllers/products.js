 
 const Product=require('../models/product');
 /**
  * 
  * const getAllProductsStatic=async(req,res)=>{
    const search='ab';
    //$regex:search,$options:'i'
   //  all items with atleas ab
   //
     const products=await Product.find({price:{$gt:30}})
     .sort("name")
     .select('name price')
     .limit(10)
     .skip(11);
    res.status(200).json({products,nbHits:products.length})
}
  */

const getAllProductsStatic=async(req,res)=>{
    const search='emp';
    //$regex:search,$options:'i'
   //  all items with atleas ab
     const {featured,company,name,sort,fields,numericFilters}=req.query;
     const queryObject={};
        if(featured){
            queryObject.featured=featured==='true'?true:false;
        }
        if(company){
            queryObject.company=company
        }
        if(name){
            queryObject.name={$regex:name,$options:'i'}
        }
         
        if(numericFilters){
            const operatorMap={
                '>':'$gt',
                '>=':'$gte',
                '=':'$e',
                '<':'$lt',
                '<=':'$lte',
                
            }
            const regEx=/\b(<|>=|=|>|<=)\b/g;
            let filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`);
            // from price>10,rating>=4
            // to   price-$gt-10,rating-$gte-4
            //console.log(filters);
            // numeric filters can only be done on numeric values
            const options=['price','rating'];
            filters=filters.split(',').map((item)=>{
                //before item.split rating-$gte-4
                //after item.split  rating $gte 4
                // array destructuring item.split('-')=[[rating] [$gte] [4]] =[field,operator,value]

                const [field,operator,value]=item.split('-');
                // check if the field is in the options of numeric value
                if(options.includes(field)){
                    // add field to queryObject eg rating={$gte:4}
                    queryObject[field]={[operator]:Number(value)}
                }
            })
        }


        console.log(queryObject);

     let result= Product.find(queryObject);
      // check if user passed in a sort
      if(sort){
      //  products=products.sort();
      // value -name,price
      // actual value sort(-name price)
      const sortList=sort.split(',').join(' ');
      result=result.sort(sortList);
      console.log(sort);
      }else{
        result=result.sort('createAt');
      }
      if(fields){
        const fieldList=fields.split(',').join(' ');
        result=result.select(fieldList);
      }
      // pagination section refresher
      const page=Number(req.query.page)||1;
      const limit=Number(req.query.limit)||10;
      const skip=(page-1) * limit;
       result=result.skip(skip).limit(limit);
      // 23 products
      // limit 7=4 7 7 7 2
     const products= await result;
    res.status(200).json({products,nbHits:products.length})
}

const getAllProducts=async(req,res)=>{
    const {featured,company,name,sort,fields,numericFilters}=req.query;
    const queryObject={}; 
    if(featured){
        queryObject.featured=featured==='true'?true:false
    }
    if(company){
        queryObject.company=company
    }
    if(name){
        queryObject.name={$regex:name,$options:'i'}
    }
// operation can be performed on properties with number value

    if(numericFilters){
      const operatorMap={
         '>':'$gt',
         '>=':'$gte',
         '=':'$e',
         '<':'$lt',
         '<=':'$lte',
      }  
      const regEx=/\b(<|>=|=|>|<=)\b/g
      // replace with call back function if there is a match
      let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
      console.log(filters);
      const options=['price','rating'];
      filters=filters.split(',').forEach((item)=>{

          // array of form price gte 40  distructure

          const [field,operator,value]=item.split('-');
          if(options.includes(field)){
              queryObject[field]={[operator]:Number(value)}
             // console.log(field,value,operator);
          }
      })
    }

   console.log(queryObject);
    
    let result=Product.find(queryObject);
// 08035410592
    if(sort){
       console.log(sort);
       const sortList=sort.split(',').join(' ');
       result=result.sort(sortList);
    } else{
        result=result.sort('createdAt');
    }
   if(fields){
       const fieldsList=fields.split(',').join(' ');
       result=result.select(fieldsList);
   }
   const page=Number(req.query.page)||1;
   const limit=Number(req.query.limit)||10;
   const skip=(page-1)*limit;
    // 0-1:0 1-1:0
   result=result.skip(skip).limit(limit);
   //23 products
   // limit 7
   // pages 7772
   const products=await result;

    res.status(200).json({products,nbHits:products.length})
}


module.exports={
    getAllProducts,
    getAllProductsStatic
}