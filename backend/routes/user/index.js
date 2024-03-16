// Routes folder contains the backend routes on which calls are made from the frontend there can be different routes for different things, in this case for tweets, comments, etc...


const { Router } = require("express");
const userController = require("../../controllers/user");

const router = Router();

// GET: /api/user/profile this is an example (for the user route)

router.use("/profile", userController.profile);

module.exports = router;