const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const mongoose = require("mongoose");

const { check, validationResult } = require("express-validator");

//Route for User Registration 

router.post(
  "/",
  [
    //Validations to be verified using .

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

    // First,find out whether the user already exists using the email.
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
       
        const payload = {
          user: {
            id: user.id,
          },
        };

       console.log("User registration was successful.");
       res.json({message:userName.name + " was succesfully registered !!!" + userName});
       
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

    //Find out whether the user exists or not

    const user = await User.findById(req.params.userid);
    
    if (!user) {
      return  res.status(400).send({ message: "No such user exists ." });
    }
    res.json(user);
    
  } catch (error) {
    console.log(error);
    res.status(500).message("error");
  }
});

// Route to delete a specific user by passing the userid


router.delete("/:uid",async (req, res) => {

  try {
    
    //Find out whether the user exists or not

    const user = await User.findById({_id: req.params.uid});
    if(!user) {
      console.log("No such user found !!!")  ;  
      return  res.status(400).json({message: "No such user exists to be deleted." });
    }

    const deletedUser = await User.findOneAndRemove({ _id: req.params.uid });
    const msg=deletedUser.name+" was deleted !"
    res.json(msg);
    console.log("user was deleted " + deletedUser);


  } catch (error) {
    
    console.log(error);
    res.status(500).message("error");
  }

});

//updating the DB :

router.put("/:userId",
[
  //Validating only name as email/password is a unique field and ideally should not be changed.
   
  check("name", "Name is required.").not().isEmpty(),
 ],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get details from the request body
  const { name, job} = req.body;

  //Create a UserObject to store details from the request body
  
  const UserObject={};
  UserObject.name=name;
  UserObject.job=job;

  try {

    //Find out whether the user exists or not

    const userToBeUpdated = await User.findById({_id: req.params.userId});

    if(!userToBeUpdated) {

        return  res.status(400).json("No such user exists .");
    }

    const userUpdated = await User.findOneAndUpdate(
                {_id: req.params.userId },
                { $set: UserObject},
                { new: true }
              ); 
    console.log("After updating user ",userUpdated);
    return res.json(userUpdated);
    
  } catch (error) {
    console.log(error);
    res.status(500).send(message,"Some error has occured " , error.message);
  }
  }
  
);

module.exports = router;