import { describe, it, expect } from "vitest";
import { getMockTranslation } from "../translator";

describe("On-Ground Translation Utility", () => {
  it("translates common first aid requests into Spanish", () => {
    const result = getMockTranslation("Where is first aid?", "es");
    expect(result).toBe("¿Dónde está la estación de primeros auxilios más cercana?");
  });

  it("translates exit requests into French", () => {
    const result = getMockTranslation("Where is the closest exit?", "fr");
    expect(result).toBe("Comment accéder à la sortie la plus proche?");
  });

  it("translates lost ticket inquiries into Japanese", () => {
    const result = getMockTranslation("I lost my ticket!", "jp");
    expect(result).toBe("チケットをなくしました。助けてもらえますか？");
  });

  it("handles empty language fallbacks gracefully", () => {
    const result = getMockTranslation("Can you help me?", "de");
    expect(result).toBe('[Translated]: "Can you help me?"');
  });

  it("is case-insensitive for inquiries", () => {
    const result = getMockTranslation("FIRST AID PLS", "es");
    expect(result).toBe("¿Dónde está la estación de primeros auxilios más cercana?");
  });
});
