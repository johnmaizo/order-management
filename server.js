require("rootpath")();
const express = require("express");
const session = require("express-session"); // Import express-session
const app = express();
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// ! Set up session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 5 * 60 * 1000, // Set session timeout to 5 minutes (5 minutes * 60 seconds * 1000 milliseconds)
    },
    // Add additional options as needed
  })
);



// Api Routes
app.use('/product', require('./ServiceAndController/products/products.controller'));
app.use("/orders", require("./ServiceAndController/orders/orders.controller"));
app.use("/products", require("./ServiceAndController/products/products.controller"));
app.use("/inventory", require("./ServiceAndController/inventories/inventories.controller"));
app.use("/auth", require("./ServiceAndController/users/users.controller"));
app.use("/branches", require("./ServiceAndController/branches/branches.controller"));

// Global Error Handler
app.use(errorHandler);

// Start Server
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log("Server listening on port " + port));