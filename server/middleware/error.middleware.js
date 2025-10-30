const errorMiddleWare = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err); 

    if (err.name === "CastError") {
      error = {
        message: { general: "Resource not found" },
        statusCode: 404,
      };
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; 
      error = {
        message: { [field]: `${field} already exists` },
        statusCode: 400,
      };
    }

    if (err.name === "ValidationError") {
      const messages = {};
      for (let field in err.errors) {
        messages[field] = err.errors[field].message;
      }
      error = {
        message: messages,
        statusCode: 400,
      };
    }

    res.status(error.statusCode || 500).json({
      success: false,
      errors: error.message || { general: "Server error" },
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleWare;
