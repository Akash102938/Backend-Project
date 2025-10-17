import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'

const generateAcessAndRefreshToken = async(userId)=>{
  try {
    const user = User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generatRefreshToken()

    user.refreshToken = refreshToken
    user.save({validaeBeforeSave: false})

    return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "Something wen wrong while generating refresh and acess Token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);

  let coverImage;
  if (coverImageLocalPath) {
    coverImage = await uploadCloudinary(coverImageLocalPath);
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async(req,res)=>{
   //req body -> data
   //username or email  
   //find the user 
   //password check
   //acess and refresh token
   //send cookie 

   const {username,email,password} = req.body

   if(!username || !email){
    throw new ApiError(400, "username or password is required")
   }

   const user = await User.findOne({
    $or: [{username},{email}]
   })

  if(!user){
    throw new ApiError(404, "user not exits")
  } 
  
  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user crendentails")
  }
  
  const {accessToken,refreshToken} = await generateAcessAndRefreshToken(user._id)
  
  const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options ={
    httpOnly: true,
    secure: true
  }

  return res.status(200).
  cookie("accessToken", accessToken,options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,{
        user: LoggedInUser,accessToken,refreshToken
      },
      "User Logged in Successfully"
    )
  )
})

const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  const options ={
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User Loggod out"))

})
export { registerUser ,logoutUser, loginUser }