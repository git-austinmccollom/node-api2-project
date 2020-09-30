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
            res
              .status(500)
              .json({ errorMessage: "server error adding to the database" });
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

router.post("/:id/comments", (req, res) => {
  const comment = {
    text: req.body.text,
    post_id: req.params.id,
  };
  if (comment.text) {
    data
      .findById(comment.id)
      .then((findRes) => {
        if (findRes.length < 1) {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        } else {
          data.insertComment(comment).then((commentRes) => {
            data
              .findCommentById(commentRes.id)
              .then((findCommentRes) => {
                res.status(201).json(findCommentRes);
              })
              .catch((findCommentErr) => {
                res
                  .status(500)
                  .json({ errorMessage: "could not find after creating" });
              });
          });
        }
      })
      .catch((findErr) => {
        res.status(500).json({ message: "could not check database" });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  }
});

router.get("/", (req, res) => {
  data
    .find()
    .then((findRes) => {
      res.status(200).json(findRes);
    })
    .then((findErr) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  data
    .findById(id)
    .then((findRes) => {
      if (findRes.length < 1) {
        res
          .status(404)
          .json({ error: "The posts information could not be retrieved." });
      } else {
        res.status(200).json(findRes);
      }
    })
    .then((findErr) => {
      // res.status(500).json({ error: "unknown server error" });
      res.status(500).json(findErr);
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  data
    .findPostComments(id)
    .then((findRes) => {
      if (findRes.length < 1) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(findRes);
      }
    })
    .then((findErr) => {
      // res.status(500).json({ error: "unknown server error" });
      res.status(500).json(findErr);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  data
    .remove(id)
    .then((findRes) => {
      if (findRes !== 1) {
        res
          .status(404)
          //   .json(findRes);
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json({ message: "post deleted" });
      }
    })
    .then((findErr) => {
      // res.status(500).json({ error: "unknown server error" });
      res.status(500).json(findErr);
    });
});

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    data
      .update(req.params.id, req.body)
      .then((dbRes) => {
        if (dbRes !==  1) {
          res.status(404).json({ message: "The post with the specified ID does not exist." });
        } else {
          data
            .findById(req.params.id)
            .then((findRes) => {
              res.status(200).json(findRes);
            })
            .catch((findErr) => {
              res
                .status(500)
                .json({ errorMessage: "could not find post after updating" });
            });
        }
      })
      .catch((err) => {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      });
  }
});

module.exports = router;
