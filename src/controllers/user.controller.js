import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "./user.controller.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser  = asyncHandler(async (req ,res ,next)=>{
    const {fullName , email, password , username } = req.body;
    console.log("email :" ,email);
    if ([fullName,username , email ,password].some((field)=>field.trim()==="")) {
      throw new ApiError(400 , "All fields are required")  
    }
    const existingUser = User.findOne({

        $or: [{emial},{username}]
    }

    )
    if(existingUser){
        throw new ApiError(409 ,"User already exits")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar is a compulsory field")
    }
    const avatar =  await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400 , "Avatar is a compulsory field")
    }
    const user = await User.create({
        fullName,
        username : username.toLowerCase(),
        email,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    })
    const createdUser = User.findById(user._id).select(
        "-password -responseToken"
    )
    if(!createdUser){
        throw new ApiError(500 , "Something wnet wrong while creating the user")
    }
    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User created successfully"),
    )

})
export {registerUser}
