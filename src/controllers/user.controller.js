import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body
    //console.log("email: ", email);

    //User details:-
    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }


    //Chech if user already exists or not:-
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existingUser) {
        throw new ApiError(409, "User already exists!");
    }


    //Get avatar(necessary) and coverImage(optional):-
    let avatarLocalPath = null;
    if (req.files.avatar && req.files.avatar[0]) {
        avatarLocalPath = req.files.avatar[0].path
    }

    if (avatarLocalPath == null) {
        throw new ApiError(400, "Avatar file is required")
    }
    let coverImageLocalPath = null;
    if (req.files.coverImage && req.files.coverImage[0]) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    //Upload on cloudinary:-
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    let coverImage = null;
    if (coverImageLocalPath != null) {
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

    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    console.log(user);

    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", user)
    )
})
const generateAccessTokenAndRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid); // Fixed typo
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken(); // Ensure this method works correctly
        const refreshToken = user.generateRefreshToken(); // Ensure this method works correctly

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // Corrected save method

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in token generation:", error); // Log the actual error for debugging
        throw new ApiError(500, error.message || "Something went wrong while generating tokens");
    }
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!username && !email) {
        throw new ApiError(400, "username or email is a must for login");
    }
    const user = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (!user) {
        throw new ApiError(404, "User does not exist!")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect Password")
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in sucessfully"
            )
        )
})
const userLogout = asyncHandler(async (req, res) => { 
    await User.findByIdAndUpdate(

        req.user._id,
        {
            $set : {
                refreshToken :undefined
            }
        } ,
        {
            new :true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200 ,{} ,"User logged out successfully"))
});
export { registerUser , loginUser , userLogout}