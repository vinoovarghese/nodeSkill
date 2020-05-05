
const express = require('express');
const app = express();


console.log("Before connecting to the Mongo DB");
const connectionToDb = require("./config/db");
const userRouter = require("./routes/api/users");

connectionToDb();

app.use(
  express.json({
    extended: false,
  })
);

app.get('/', (request, response) => {
  
  response.json({name:"Vinoo",password:"vinoo", email:"vinoo@gmail.com",job:"Developer"})
  console.log(listEndpoints(app));
});
app.get('/test', (request, response) => {
    response.send('Testing the /test api call once again .');
  });

app.use("/api/vinoonode/users", userRouter);

app.listen(3000, () => {
  console.log('TIDE DB example running on localhost:3000');
});