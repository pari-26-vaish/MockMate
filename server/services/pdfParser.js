import { PDFParse } from "pdf-parse";

const extractPdfText = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid PDF buffer");
  }

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return result.text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } finally {
    await parser.destroy();
  }
};

export default extractPdfText;