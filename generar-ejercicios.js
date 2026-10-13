import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // La API key se lee de forma segura desde las Variables de Entorno del servidor (Vercel/Netlify)
    // Nunca está escrita en el código fuente ni se sube a GitHub.
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Eres un profesor de informática de Grado Medio (SMR). Crea exactamente 20 ejercicios interactivos variados sobre la Unidad de Trabajo 1 (Pensamiento computacional, modelo E-P-S, descomposición, patrones, abstracción, algoritmos, pseudocódigo y diagramas de flujo).
      Devuelve ÚNICAMENTE un array JSON válido, sin markdown ni texto extra, con esta estructura exacta:
      [
        {
          "pregunta": "Enunciado claro del ejercicio",
          "opciones": ["Opción A", "Opción B", "Opción C"],
          "respuestaCorrecta": 0,
          "explicacion": "Explicación breve de por qué esta es la respuesta correcta."
        }
      ]`,
    });

    let jsonText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const ejercicios = JSON.parse(jsonText);

    return res.status(200).json(ejercicios);
  } catch (error) {
    console.error('Error generando ejercicios:', error);
    return res.status(500).json({ error: error.message });
  }
}
