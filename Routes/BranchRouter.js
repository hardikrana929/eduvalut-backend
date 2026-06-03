// const express = require("express");
// const router = express.Router();
// const auth = require("../Middlware/AdminMiddlware");
// const { addBranch } = require("../Controllers/BranchController");

// router.post("/addbranch", auth, addBranch);

// module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/AdminMiddlware");
const {
  addBranch,
  changeBranch,
  removeBranch,
  getBranch,
  getoneBranch,
} = require("../Controllers/BranchController");

router.get("/getBranch", getBranch);

router.get("/getBranch/:id", auth, getoneBranch);

router.post("/addBranch", auth, addBranch);

router.put("/changeBranch/:id", auth, changeBranch);

router.delete("/removeBranch/:id", auth, removeBranch);

module.exports = router;
