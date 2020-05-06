const express = require("express");
const router = express.Router();
const User = require("../../Models/User");


const { check, validationResult } = require("express-validator");

//route for User Registration : 
router.post(
  "/",
  [
    //Validations to be verified.

    check("name", "Name is required.").not().isEmpty(),
    check("email", "Please enter a valid email.").isEmail(),
    check("password", "Please enter a longer password.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password, email,job } = req.body;

    // First,find out whether the user already exists .
     try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({ errors: [{ message: "User already exists ." }] });
      } else {
        

        user = new User({
          name,
          password,
          email,
          job,
        });

        var userName = await user.save();
        console.log("Username is " + userName);

        const payload = {
          user: {
            id: user.id,
          },
        };

       console.log("User registration was successful.");
       res.json({message:userName.name + " was succesfully registered !!!" + userName})
       
      }
    } catch (err) {
      res.status(500).send("error");
    }
  }
);

// Route to get all the users

router.get("/allUsers", async (req, res) => {
  try {
     const allUsers = await User.find().populate("user");
     res.json(allUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).message("error");
  }
});

// Route to get a specific user by passing the userid

router.get("/:userid", async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);
    
    if (!user) {
      res.status(400).message("error");
    }
    res.json(user);
    
  } catch (error) {
    console.log(error);
    res.status(500).message("error");
  }
});


router.delete("/:uid",async (req, res) => {

  try {
    
    // We need to find whether the user is existing or not..If not,throw an error

    const user = await User.findById({_id: req.params.uid});
    if(!user) {

      return  res.status(400).json({ errors: [{ message: "No such user exists ." }] });
    }

    const deletedUser = await User.findOneAndRemove({ _id: req.params.uid });
    const msg=user.name+" was deleted !"
    res.json(msg);
    console.log("user was deleted " + deletedUser);


  } catch (error) {
    
    console.log(error);
    res.status(500).message("error");
  }

});

module.exports = router;