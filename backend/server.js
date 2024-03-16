const dotenv = require("dotenv");
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app"); // <--- Here we are importing the app from the app folder (index.js) file
const config = require("./config");

dotenv.config();

const server = http.createServer(app);

// Here we connect the database to our server DB name is campusconnect
mongoose
  .connect('mongodb://127.0.0.1:27017/dobby')
  .then(() => {
    console.log("mongodb connected");
// Server.listen means on which PORT will the server be running (just like different services that run on your pc)
    server.listen(4000, () => {
      console.log(`Server running on port: 4000`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(0);
  });


  // Basic server with routes such as LOGIN, SIGNUP, REFRESH TOKEN is set up