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


router.delete("/:uid",async (req, res) => {

  try {
    
    // We need to find whether the user is existing or not..If not,throw an error

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
  //Validations to be verified.

  check("name", "Name is required.").not().isEmpty(),
 ],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, job} = req.body;

  const UserObject={};
  
  UserObject.name=name;
  UserObject.job=job;

  try {
    const userToBeUpdated = await User.findById({_id: req.params.userId});
    if(!userToBeUpdated) {

      console.log("in the if not loop");
      return  res.status(400).json("No such user exists .");
    }

    //Validating only name as email is a unique field and ideally should not be changed.
    //const userUpdated = await User.findByIdAndUpdate(req.params.userId);
    
    console.log("Before updating user");
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