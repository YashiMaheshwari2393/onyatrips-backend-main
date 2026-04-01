import express from "express";
import bucketListRouter from "./routes/bucketlist";
import feedbackRouter from "./routes/feedback";
import supportRouter from "./routes/support";

const app = express();
app.use(express.json());

app.use("/api/bucket-list", bucketListRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/support", supportRouter);

app.listen(3000, () => console.log("Server running on port 3000"));