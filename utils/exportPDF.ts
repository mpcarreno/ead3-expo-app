// utils/exportViewToPdf.ts

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

/**
 * Captura una vista con ViewShot, genera un PDF desde esa imagen
 * y permite compartirlo sin usar rutas de FileSystem.
 *
 * @param viewRef - referencia a un ViewShot
 * @param fileName - nombre sugerido del PDF
 */
export async function exportPDF(
  viewRef: any,
  fileName: string = "reporte.pdf"
) {
  try {
    if (!viewRef?.current) {
      throw new Error("La referencia del ViewShot es inválida.");
    }

    // 1) Capturar la vista como base64
    const base64 = await captureRef(viewRef, {
      format: "png",
      quality: 1,
      result: "base64",
    });

    // 2) Crear HTML para incrustar la imagen
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

    // 3) Convertir HTML a PDF temporal
    const { uri: pdfUri } = await Print.printToFileAsync({
      html,
    });

    console.log("PDF generado temporalmente:", pdfUri);

    // 4) Compartir el archivo PDF
    const sharingAvailable = await Sharing.isAvailableAsync();
    if (!sharingAvailable) {
      throw new Error("El sistema no permite compartir archivos.");
    }

    await Sharing.shareAsync(pdfUri, {
      UTI: "com.adobe.pdf",
      mimeType: "application/pdf",
      dialogTitle: "Compartir reporte",
    });

    return pdfUri;
  } catch (error) {
    console.error("Error al generar PDF desde ViewShot:", error);
    throw error;
  }
}
