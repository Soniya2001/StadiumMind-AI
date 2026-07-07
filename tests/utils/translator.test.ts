import { describe, it, expect } from 'vitest';
import { getMockTranslation } from '../../src/utils/translator';

describe('Translator Utility', () => {
  it('should return Spanish translation correctly for "first aid"', () => {
    const text = 'Where is the first aid?';
    const result = getMockTranslation(text, 'es');
    expect(result).toBe('¿Dónde está la estación de primeros auxilios más cercana?');
  });

  it('should return Spanish translation correctly for "exit"', () => {
    const text = 'Please show me the exit';
    const result = getMockTranslation(text, 'es');
    expect(result).toBe('¿Cómo llego a la salida más rápida?');
  });

  it('should return Spanish translation correctly for "lost"', () => {
    const text = 'I am lost';
    const result = getMockTranslation(text, 'es');
    expect(result).toBe('He perdido mi boleto, ¿me puede ayudar?');
  });

  it('should return Spanish fallback correctly', () => {
    const text = 'Where is the bathroom?';
    const result = getMockTranslation(text, 'es');
    expect(result).toBe('[Traducido al Español]: "Where is the bathroom?"');
  });

  it('should return French translation correctly for "first aid"', () => {
    const text = 'I need first aid';
    const result = getMockTranslation(text, 'fr');
    expect(result).toBe('Où se trouve le poste de secours le plus proche?');
  });

  it('should return French translation correctly for "exit"', () => {
    const text = 'Where is the exit?';
    const result = getMockTranslation(text, 'fr');
    expect(result).toBe('Comment accéder à la sortie la plus proche?');
  });

  it('should return French translation correctly for "lost"', () => {
    const text = 'Help, I am lost';
    const result = getMockTranslation(text, 'fr');
    expect(result).toBe("J'ai perdu mon billet, pouvez-vous m'aider?");
  });

  it('should return French fallback correctly', () => {
    const text = 'Where is food?';
    const result = getMockTranslation(text, 'fr');
    expect(result).toBe('[Traduit en Français]: "Where is food?"');
  });

  it("should return Japanese translation correctly for 'first aid'", () => {
    const text = "Where is first aid?";
    const result = getMockTranslation(text, "jp");
    expect(result).toBe("救護所はどこですか？ (Kyūgosho wa doko desu ka?)");
  });

  it("should return Japanese translation correctly for 'exit'", () => {
    const text = "Where is the exit?";
    const result = getMockTranslation(text, "jp");
    expect(result).toBe("一番近い出口はどこですか？ (Ichiban chikai deguchi wa doko desu ka?)");
  });

  it('should return Japanese translation correctly for "lost"', () => {
    const text = 'I lost my ticket';
    const result = getMockTranslation(text, 'jp');
    expect(result).toBe('チケットをなくしました。助けてもらえますか？');
  });

  it('should return Japanese fallback correctly', () => {
    const text = 'Nice match';
    const result = getMockTranslation(text, 'jp');
    expect(result).toBe('[日本語訳]: "Nice match"');
  });

  it('should fallback gracefully for unknown language', () => {
    const text = 'Hello world';
    const result = getMockTranslation(text, 'unknown');
    expect(result).toBe('[Translated]: "Hello world"');
  });
});

