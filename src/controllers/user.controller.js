import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const {fullname, username, email, password} = req.body
    //console.log("email: ", email);

    //User details:-
    if([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    

    //Chech if user already exists or not:-
    const existingUser = await User.findOne({
        $or : [{ email }, { username }]
    })
    if(existingUser) {
        throw new ApiError(409, "User already exists!");
    }


    //Get avatar(necessary) and coverImage(optional):-
    let avatarLocalPath = null;
    if(req.files.avatar && req.files.avatar[0]) {
        avatarLocalPath = req.files.avatar[0].path
    }
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    let coverImageLocalPath = null;
    if(req.files.coverImage && req.files.coverImage[0]) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    //Upload on cloudinary:-
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    let coverImage = null;
    if(coverImageLocalPath != null) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }


    //Create user entry in database:-
    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : ""
    })
    
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!userCreated) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    console.log(user);
    
    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", user)
    )
})

export { registerUser }