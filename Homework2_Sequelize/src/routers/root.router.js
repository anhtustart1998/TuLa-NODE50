import express from "express";
import likeRouter from "./like.router.js";
import rateRouter from "./rate.router.js";

const rootRouter = express.Router();

rootRouter.use("/like", likeRouter);
rootRouter.use("/rate", rateRouter);

export default rootRouter;
