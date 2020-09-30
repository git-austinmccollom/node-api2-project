const express = require("express");
const data = require("./data/db.js");
const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    data
      .insert(req.body)
      .then((dbRes) => {
        console.log(dbRes);
        newId = dbRes.id;
        data
          .findById(newId)
          .then((findRes) => {
            res.status(201).json(findRes);
          })
          .catch((findErr) => {
            res.json({ errorMessage: "server error adding to the database" });
          });

        // res.status(201).json({ success: "yes?" });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ errorMessage: "server error adding to the database" });
      });
  }
});

// router.get('/', (req, res) => {
//     res.status(200).send({})
// })

module.exports = router;
