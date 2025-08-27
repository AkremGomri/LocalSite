/* eslint-disable @typescript-eslint/no-explicit-any */
import { PROVIDERS, MODELS } from "./providers";

export async function getDynamicModels() {
  const isLocalMode = process.env.NEXT_PUBLIC_LOCAL_MODE === "true";
  
  if (!isLocalMode) {
    return MODELS;
  }
  
  try {
    // Récupérer les modèles Ollama disponibles
    const response = await fetch("/api/ollama-models");
    if (response.ok) {
      const data = await response.json();
      
      // Combiner les modèles cloud et locaux
      const ollamaModels = data.models || [];
      
      // Filtrer les modèles cloud en mode local
      const cloudModels = isLocalMode ? [] : MODELS.filter(m => !m.isLocal);
      
      return [...ollamaModels, ...cloudModels];
    }
  } catch (error) {
    console.error("Failed to fetch dynamic models:", error);
  }
  
  // Fallback aux modèles statiques
  return isLocalMode ? MODELS.filter(m => m.isLocal) : MODELS;
}

export { PROVIDERS };