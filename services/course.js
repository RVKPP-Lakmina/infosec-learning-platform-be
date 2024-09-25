import fs from "fs";

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const statementKeysPath = `configs/courses.json`;
    const descriptionsPath = `./configs/course-module-content/${courseId}.json`;
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    if (!fs.existsSync(descriptionsPath)) {
      return res.status(404).json({ message: "Course content not found" });
    }

    let descData = fs.readFileSync(descriptionsPath, "utf8");
    templateData = JSON.parse(templateData);
    descData = JSON.parse(descData);

    const course = templateData.find((course) => course.id == courseId);

    let data = { courseDetails: course, courseContent: descData };

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course found", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourseStatus = async (req, res) => {
  const { courseId, data } = req.body;

  try {
    const statementKeysPath = `configs/courses.json`;
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    templateData = JSON.parse(templateData);
    const course = templateData.find((course) => course.id == courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.userStatus = {
      ...course.userStatus,
      ...data,
    };

    fs.writeFileSync(statementKeysPath, JSON.stringify(templateData));

    return res.status(200).json({ message: "Course status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
