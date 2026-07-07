import { describe, it, expect } from 'vitest';
import { getMockTranslation } from '../../src/utils/translator';

describe('Translator Utility', () => {
  it('should return Spanish translation correctly for "first aid"', () => {
    const text = 'Where is the first aid?';
    const result = getMockTranslation(text, 'es');
    expect(result).toBe('¿Dónde está la estación de primeros auxilios más cercana?');
  });

  it('should return Spanish fallback correctly', () => {
    const text = 'Where is the bathroom?';
    const result = getMockTranslation(text, 'es');
    expect(result).toBe('[Traducido al Español]: "Where is the bathroom?"');
  });

  it('should return French translation correctly for "exit"', () => {
    const text = 'Where is the exit?';
    const result = getMockTranslation(text, 'fr');
    expect(result).toBe('Comment accéder à la sortie la plus proche?');
  });

  it('should return Japanese translation correctly for "lost"', () => {
    const text = 'I lost my ticket';
    const result = getMockTranslation(text, 'jp');
    expect(result).toBe('チケットをなくしました。助けてもらえますか？');
  });

  it('should fallback gracefully for unknown language', () => {
    const text = 'Hello world';
    const result = getMockTranslation(text, 'unknown');
    expect(result).toBe('[Translated]: "Hello world"');
  });
});
