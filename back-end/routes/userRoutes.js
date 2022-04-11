const express = require("express");
const router = express.Router();
//REMOVE THESE!!!
const data = {};
data.users = require("./users.json");

router
  .route("/users")
  .get((req, res) => {
    res.json(data.users);
  })
  .post((req, res) => {
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .put((req, res) => {
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .delete((req, res) => {
    res.json({ id: req.body.id });
  });

router.route("/api/users/:id").get((req, res) => {
  res.json({ id: req.params.id });
});

// app.get("/api/users", async (req, res) => {
//   const result = await dbOperations.getUsers();
//   res.send(result.recordset);
// });

// app.post("/api/users", async (req, res) => {
//   const result = await dbOperations.addUser(req.body);
//   res.send("New User Added");
// });

module.exports = router;
