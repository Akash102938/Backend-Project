import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is Subscribing
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whom is Subscriber is Subscribing
        ref: "User"
    }
},{timeStamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)