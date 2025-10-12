import { Router } from "express";
<<<<<<< HEAD
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)
=======
import { registerUser } from "../controllers/user.controller";
import upload from '../middlewares/multer.middleware.js'

const router = Router()

router.route("/register").post(
    upload.fields([
      {
        name: 'avatar',
        maxcount: 1
      },
      {
        name: "coverImage",
        maxcount: 2,
      }
    ]),
    registerUser)
>>>>>>> 6869473dd424849d8d2706bc52202d4fce734492

export default router