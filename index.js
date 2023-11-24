const express = require("express");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();

const router = require("./routes/router.js");

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.set("view engine", "ejs");
router(app);


// Start the server
const server = app.listen(port, (error) => {
    if (error){
        return console.log(`Error: ${error}`);
    }
    console.log(`Server listening on port ${server.address().port}`);
});