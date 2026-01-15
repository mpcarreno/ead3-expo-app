// utils/exportViewToPdf.ts

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

/**
 * Captures a view with ViewShot, generates a PDF from that image
 * and allows sharing it without using FileSystem routes.
 *
 * @param viewRef - reference to a ViewShot
 * @param fileName - suggested name for the PDF
 */
export async function exportPDF(
  viewRef: any,
  fileName: string = "reporte.pdf"
) {
  try {
    if (!viewRef?.current) {
      throw new Error("La referencia del ViewShot es inválida.");
    }

    // 1) Capture the view as base64
    const base64 = await captureRef(viewRef, {
      format: "png",
      quality: 1,
      result: "base64",
    });

    // 2) Create HTML to embed the image
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            body { margin: 0; padding: 0; }
            img { width: 100%; height: auto; display: block; }
          </style>
        </head>
        <body>
          <img src="data:image/png;base64,${base64}" />
        </body>
      </html>
    `;

    // 3) Convert HTML to temporary PDF
    const { uri: pdfUri } = await Print.printToFileAsync({
      html,
    });

    console.log("PDF generated temporarily:", pdfUri);

    // 4) Share the PDF file
    const sharingAvailable = await Sharing.isAvailableAsync();
    if (!sharingAvailable) {
      throw new Error("The system does not allow sharing files.");
    }

    await Sharing.shareAsync(pdfUri, {
      UTI: "com.adobe.pdf",
      mimeType: "application/pdf",
      dialogTitle: "Compartir reporte",
    });

    return pdfUri;
  } catch (error) {
    console.error("Error generating PDF from ViewShot:", error);
    throw error;
  }
}
