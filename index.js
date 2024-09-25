// const connectDB = require("./db");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import {
  getCompletedCourseList,
  downloadCourseContent,
} from "./services/home.js";
import { getCourseList, startNewCourse } from "./services/courses.js";
import { getCourseById, updateCourseStatus } from "./services/course.js";
import { login } from "./services/auth.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 5000;

//ROUTES

// AUTH ROUTES
app.post("/login", login);

// HOME ROUTES
app.get("/completed-courses", getCompletedCourseList);
app.get("/download-news-article", downloadCourseContent);

// COURSES ROUTES
app.get("/courses", getCourseList);
app.post("/start-new-course", startNewCourse);

// COURSE ROUTES
app.get("/get-course-by-id", getCourseById);
app.post("/update-course-status", updateCourseStatus);

//HELPER ROUTES
app.post("/reset-courses", (req, res) => {
  // Get the directory name
  let __dirname = path.resolve();
  
  // Path to the courses configuration file
  const statementKeysPath = path.join(__dirname, "configs/courses.json");
  
  // Read the courses configuration file
  let templateData = fs.readFileSync(statementKeysPath, "utf8");
  
  // Parse the JSON data
  templateData = JSON.parse(templateData);

  // Reset the user status for each course
  templateData = templateData.map((course) => {
    course.userStatus = {
      startDate: null,
      completed: false,
      prcentageCompleted: 0,
    };
    return course;
  });

  // Write the updated data back to the file
  fs.writeFileSync(statementKeysPath, JSON.stringify(templateData));

  // Send a response indicating success
  return res.status(200).json({ message: "Courses reset" });
});

//SERVER
app.listen(PORT, () => {
  // connectDB();
  console.log(`Server running on port ${PORT}`);
});
