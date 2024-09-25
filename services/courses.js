import fs from "fs";

// Function to get the list of courses
export const getCourseList = async (req, res) => {
  try {
    // Extract userId from the query parameters
    const { userId } = req.query;

    // Path to the JSON file containing course data
    const statementKeysPath = `configs/courses.json`;

    // Read the course data from the JSON file
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    // Prepare the response data
    const responseData = { status: 1, data: templateData };

    // Send the response with status 200 (OK)
    return res.status(200).json(responseData);
  } catch (error) {
    // Handle any errors by sending a 500 (Internal Server Error) response
    return res
      .status(500)
      .json({ status: -1, message: "Internal server error" });
  }
};

// Function to start a new course
export const startNewCourse = async (req, res) => {
  // Extract courseId from the request body
  const { courseId } = req.body;

  try {
    // Path to the JSON file containing course data
    const statementKeysPath = `configs/courses.json`;

    // Read the course data from the JSON file
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    // Parse the JSON data
    templateData = JSON.parse(templateData);

    // Find the course with the given courseId
    const course = templateData.find((course) => course.id == courseId);

    // If the course is not found, send a 404 (Not Found) response
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course status for the user
    course.userStatus = {
      ...course.userStatus,
      startDate: new Date(),
      completed: false,
      prcentageCompleted: 0,
    };

    // Write the updated course data back to the JSON file
    fs.writeFileSync(statementKeysPath, JSON.stringify(templateData));

    // Send a response indicating the course has started
    return res.status(200).json({ message: "Course started" });
  } catch (error) {
    // Handle any errors by sending a 500 (Internal Server Error) response
    return res.status(500).json({ message: "Internal server error" });
  }
};
