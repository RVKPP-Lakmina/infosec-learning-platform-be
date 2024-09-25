import fs from "fs";

// This function retrieves a list of completed courses for a user
export const getCompletedCourseList = async (req, res) => {
  try {
    // Extract userId from the request query parameters
    const { userId } = req.query;
    
    // Path to the JSON file containing course information
    const statementKeysPath = `configs/courses.json`;
    
    // Read the file synchronously
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    // Parse the JSON data (string to object)
    templateData = JSON.parse(templateData);

    // Filter the courses to get only the completed ones
    templateData = templateData.filter((course) => course.userStatus.completed);

    // Prepare the response data
    const responseData = { status: 1, data: JSON.stringify(templateData) };

    // Send the response with status 200 (OK)
    return res.status(200).json(responseData);
  } catch (error) {
    // Handle any errors by sending a 500 (Internal Server Error) response
    return res
      .status(500)
      .json({ status: -1, message: "Internal server error" });
  }
};

// This function handles the download of course content
export const downloadCourseContent = (req, res) => {
  try {
    // Path to the JSON file containing news template configurations
    const filePath = `configs/news-template-configurations.json`;
    
    // Read the file synchronously
    const fileData = fs.readFileSync(filePath, "utf8");
    
    // Parse the JSON data
    const fileDataDecode = JSON.parse(fileData);
    
    // Get the file name from the parsed data using the query parameter 'name'
    const fileName = fileDataDecode[req.query.name].file;
    
    // Path to the asset file
    const assetPath = `./assets/${fileName}`;

    // Check if the file exists
    if (fs.existsSync(assetPath)) {
      // Send the file if it exists
      res.sendFile(fileName, { root: "./assets" });
    } else {
      // Send a 404 response if the file is not found
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    // Handle any errors by sending a 500 (Internal Server Error) response
    res.status(500).json({ message: "Internal server error" });
  }
};
