/**
 * Utility translation mapping for basic on-ground stadium inquiries.
 * Supports basic spectator questions in English, Spanish, French, and Japanese.
 */
export const getMockTranslation = (text: string, lang: string): string => {
  const t = text.trim().toLowerCase();
  
  if (lang === "es") {
    if (t.includes("first aid")) return "¿Dónde está la estación de primeros auxilios más cercana?";
    if (t.includes("exit")) return "¿Cómo llego a la salida más rápida?";
    if (t.includes("lost")) return "He perdido mi boleto, ¿me puede ayudar?";
    return `[Traducido al Español]: "${text}"`;
  }
  
  if (lang === "fr") {
    if (t.includes("first aid")) return "Où se trouve le poste de secours le plus proche?";
    if (t.includes("exit")) return "Comment accéder à la sortie la plus proche?";
    if (t.includes("lost")) return "J'ai perdu mon billet, pouvez-vous m'aider?";
    return `[Traduit en Français]: "${text}"`;
  }
  
  if (lang === "jp") {
    if (t.includes("first aid")) return "救護所はどこですか？ (Kyūgosho wa doko desu ka?)";
    if (t.includes("exit")) return "一番近い出口はどこですか？ (Ichiban chikai deguchi wa doko desu ka?)";
    if (t.includes("lost")) return "チケットをなくしました。助けてもらえますか？";
    return `[日本語訳]: "${text}"`;
  }
  
  return `[Translated]: "${text}"`;
};
