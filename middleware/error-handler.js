const errorHandlerMiddleware = async (err, req, res, next) => {
  // using express-async-erros from router to custom error handler
  console.log(err)
  
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware
