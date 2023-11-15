import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import mockHotelData from "./mock-data/Room.mock.json"
import Hotel from "./models/Hotel.js";

import * as fs from 'fs';
import Room from "./models/Room.js";

// const mockHotelData = JSON.parse(fs.readFileSync('./mock-data/Room.mock.json', 'utf-8'));

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors(
  {origin:"http://localhost:5173",
}
))
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
const PORT = process.env.PORT || 8080
app.listen(PORT,async () => {
  connect();
  // console.log(mockHotelData)
  // const _ = await Room.insertMany(mockHotelData)
  // console.log(_)
  console.log("Connected to server on: ", PORT);
});
