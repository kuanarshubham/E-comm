import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User} from "../models/Users.models.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const register = asyncHandler(async (req, res) => {
    const {fullName, userName, password, email} = req.body;

    if([fullName, email, userName, password].some((feild) => feild?.trim() === "")){
        throw new ApiError(400, "All feilds are required");
    }

    const exisitedUser = await User.findOne({
        $or: [{email}, {userName}]
    });

    if(exisitedUser) {throw new ApiError(409, "Already existing username or email");}

    const user = await User.create({
        fullName,
        email,
        password,
        userName: userName
    });


    //finding the user from DB and selcting the feilds which are to be sent
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //checking if recent made user exist
    if(!createdUser){throw new ApiError(500, "User not formed");}

    //sending the response
    return res.status(201).json(new ApiResponse(201, createdUser, "New User created sucessfully"));
});

export const login = asyncHandler(async (req, res) => {
    const {userName, email, password} = req.body;

    if(!userName && !email){
        throw new ApiError(400, "Username/Email not provided")
    }

    
    const user = await User.findOne({
        $or: [{userName}, {email}]
    });

    if(!user){throw new ApiError(400, "No user found");}

    if(!(user.isPasswordCorrect(password))){throw new ApiError(401, "Password incorrect");}

    //const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    //since the above "user" does not have refreshToken, we will call again without the password and resfesh token
    const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            user: loggedUser, 
        },
        "User logged in successfully"
    ));

});