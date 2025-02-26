function errorHandler(error, name, from) {
  let loggerFunction = console.log;
  // if (process.env.ENV === "PROD") {
  //we can have a different logger if needed
  // }
  loggerFunction("----------START-----------");
  loggerFunction("Error occured in " + name);

  if (from === "axios") {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      loggerFunction(error.response.data);
      loggerFunction(error.response.status);
      loggerFunction(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      loggerFunction(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      loggerFunction("Error", error.message);
    }
    loggerFunction(error.toJSON());
  } else {
    loggerFunction(error);
  }

  loggerFunction("----------END-----------");
}

module.exports = {
  errorHandler,
};
