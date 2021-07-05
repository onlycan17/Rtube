import expres from "express";
import {
         getEdit
        ,postEdit
        ,logout
        ,see
        ,startGithubLogin
        ,finishGithubLogin
        ,getChangePassword
        ,postChangePassword
    } from "../controllers/userController";
import {protectorMiddleware
        ,publicOnlyMiddleware
        ,avatarUpload
        ,uploadFiles
    } from "../middlewares";    

const userRouter = expres.Router();

userRouter.get("/logout",protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"),postEdit);
userRouter.get("/github/start",publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);

userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;