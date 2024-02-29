import bcrypt from "bcrypt";
import jwc from "jsonwebtoken";
import user from "../models/user.js";
import User from "../models/user.js";

/* REGISTER USER */ 
//Calling MongoDB, req = request from front end | res = response is what sent back to frontend
export const register = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        
        //Password encrpyt ||making random salt made by bcrypt => using it to encrypt pass to hash it
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password.salt); 

        const newUSer = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        //Status code : 201 = something created, create json version of user so front end gets res
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json({error: err.message});       
    }
}

//LOGIN IN CODE//
export const login = async(req, res) => {
    try{
        //Mongoose to findOne that has specified email
        const {email, password} = req.body;
        const user = await User.findOne({ email: email})
        if (!user) return res.status(400).json({ msg: "User does not exist!"});
        
        //Bcrypt to compare password saved and one that was entered (see if same hash)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials"});
        
        //Json Web Token, delete token so it's not sent to front-end : safe
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    }catch(err){
        res.status(500).json({error: err.message});       
    }
}