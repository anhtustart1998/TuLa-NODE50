// npx sequelize-auto -h localhost -d db_test -u root -x 1234 -p 3307  --dialect mysql -o src/models -l esm -a src/models/additional.json
import express from "express";
import rootRouter from "./src/routers/root.router.js";
import { handleError } from "./src/common/helper/error.helper.js";

const app = express();
app.use(express.json());
app.use("/api", rootRouter);
app.use(handleError);

app.listen(3069, () => {
  console.log("Server is running on port 3069");
});
