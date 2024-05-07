import * as FileSystem from 'expo-file-system';

/**
 * Save PDF data to a file and return its URI.
 * 
 * @param {Uint8Array} pdfBytes - The PDF data to save.
 * @return {Promise<string>} - The file URI.
 */
export const savePdf = async (pdfBytes) => {
  try {
    // Create a filename for the PDF
    const filename = `ticket_${Date.now()}.pdf`;
    const path = `${FileSystem.documentDirectory}${filename}`;

    // Convert Uint8Array to base64
    const base64 = Buffer.from(pdfBytes).toString('base64');

    // Write the file
    await FileSystem.writeAsStringAsync(path, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Return the file URI
    return path;
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
};


export const downloadPdf = async (pdfUrl) => {
  const fileName = 'billets.pdf';
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  try {
    // Download the file
    await FileSystem.downloadAsync(pdfUrl, filePath);
    return filePath;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};
