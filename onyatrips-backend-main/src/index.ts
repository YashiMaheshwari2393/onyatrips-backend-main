import express from "express";
import bucketListRouter from "./routes/bucketlist";
import feedbackRouter from "./routes/feedback";

const app = express();
app.use(express.json());

app.use("/api/bucket-list", bucketListRouter);
app.use("/api/feedback", feedbackRouter);

app.listen(3000, () => console.log("Server running on port 3000"));