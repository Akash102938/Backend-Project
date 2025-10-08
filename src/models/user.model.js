import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bycrpt from "bcrypt"

const userSchema = new Schema({
    
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true,
    },
     avatar:{
        type: String,   //will use cloudinary url 
        required: true
    },
    coverImage:{
        type: String
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password:{
        type: String,
        required: [true,"Password is required"]
    },
    refreshToken:{
        type: String
    }
},{timestamps: true})

userSchema.pre("save", async function(next){
   if(!this.isModified("password")) return next();
   this.password = bycrpt.hash(this.password,10)
   next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bycrpt.compare(password, this.password)
}
userSchema.methods,generateAccessToken= function(){
   jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}

userSchema.methods,generatRefreshToken= function(){
   jwt.sign(
    {
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}


export const user = mongoose.model("User",userSchema)