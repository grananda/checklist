import { describe, it, expect } from 'vitest';
import { validarTitulo, validarDescripcion, LIMITES_DEFAULT } from '../src/index.js';

describe('validarTitulo', () => {
  it('rechaza título vacío', () => {
    expect(validarTitulo('   ').ok).toBe(false);
  });

  it('acepta título válido', () => {
    expect(validarTitulo('Comprar leche').ok).toBe(true);
  });

  it('rechaza título que supera el límite', () => {
    const largo = 'a'.repeat(LIMITES_DEFAULT.maxTituloLen + 1);
    expect(validarTitulo(largo).ok).toBe(false);
  });
});

describe('validarDescripcion', () => {
  it('acepta descripción ausente', () => {
    expect(validarDescripcion(undefined).ok).toBe(true);
  });

  it('rechaza descripción que supera el límite', () => {
    const larga = 'a'.repeat(LIMITES_DEFAULT.maxDescLen + 1);
    expect(validarDescripcion(larga).ok).toBe(false);
  });
});
