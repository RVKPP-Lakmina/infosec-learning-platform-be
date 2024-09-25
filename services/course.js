import fs from "fs";

// Function to get course details by ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.query;

    // Check if courseId is provided in the request
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Paths to the course configuration and course content files
    const statementKeysPath = `configs/courses.json`;
    const descriptionsPath = `./configs/course-module-content/${courseId}.json`;

    // Read the course configuration file
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    // Check if the course content file exists
    if (!fs.existsSync(descriptionsPath)) {
      return res.status(404).json({ message: "Course content not found" });
    }

    // Read the course content file
    let descData = fs.readFileSync(descriptionsPath, "utf8");

    // Parse the JSON data from the files
    templateData = JSON.parse(templateData);
    descData = JSON.parse(descData);

    // Find the course details from the configuration file
    const course = templateData.find((course) => course.id == courseId);

    // Prepare the response data
    let data = { courseDetails: course, courseContent: descData };

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Return the course details and content
    return res.status(200).json({ message: "Course found", data });
  } catch (error) {
    // Handle any errors that occur
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update the status of a course
export const updateCourseStatus = async (req, res) => {
  const { courseId, data } = req.body;

  try {
    // Path to the course configuration file
    const statementKeysPath = `configs/courses.json`;

    // Read the course configuration file
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    // Parse the JSON data from the file
    templateData = JSON.parse(templateData);

    // Find the course details from the configuration file
    const course = templateData.find((course) => course.id == courseId);

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course status with the provided data
    course.userStatus = {
      ...course.userStatus,
      ...data,
    };

    // Write the updated course configuration back to the file
    fs.writeFileSync(statementKeysPath, JSON.stringify(templateData));

    // Return a success message
    return res.status(200).json({ message: "Course status updated" });
  } catch (error) {
    // Handle any errors that occur
    return res.status(500).json({ message: "Internal server error" });
  }
};
