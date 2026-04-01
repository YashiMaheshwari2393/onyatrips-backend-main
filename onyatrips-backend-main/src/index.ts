import express from "express";
import bucketListRouter from "./routes/bucketlist";

const app = express();
app.use(express.json());

app.use("/api/bucket-list", bucketListRouter);

app.listen(3000, () => console.log("Server running on port 3000"));