import extractPdfText from "../services/pdfParser.js";

export const parseResume = async (req, res) => {
  try {
    // Check if PDF was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume",
      });
    }

    // Extract text from PDF
    const resumeText = await extractPdfText(req.file.buffer);

    // Basic candidate skills extraction
    const skillsList = [
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Java",
      "Python",
      "C++",
      "SQL",
      "HTML",
      "CSS",
      "Git",
      "GitHub",
    ];

    const foundSkills = skillsList.filter((skill) =>
      resumeText.toLowerCase().includes(skill.toLowerCase())
    );

    res.status(200).json({
      message: "Resume parsed successfully",
      skills: foundSkills,
      textLength: resumeText.length,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);

    res.status(500).json({
      message: "Failed to parse resume",
      error: error.message,
    });
  }
};