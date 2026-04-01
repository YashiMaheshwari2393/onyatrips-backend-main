"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bucketlist_1 = __importDefault(require("./routes/bucketlist"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const support_1 = __importDefault(require("./routes/support"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/bucket-list", bucketlist_1.default);
app.use("/api/feedback", feedback_1.default);
app.use("/api/support", support_1.default);
app.listen(3000, () => console.log("Server running on port 3000"));
