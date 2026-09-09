const parseAIResponse = (response) => {
  try {
    let cleanedResponse = response.trim();

    // Remove markdown code fences if the AI returns ```json ... ```
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Failed to parse AI response:", error.message);
    throw new Error("Invalid JSON response from AI");
  }
};

export default parseAIResponse;