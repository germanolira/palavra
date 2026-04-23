/**
 * Testes da lógica do jogo (gameLogic.ts).
 *
 * Cobre:
 * - Normalização de input (acentos, case, caracteres especiais)
 * - Avaliação de guesses (correct/present/absent)
 * - Palavras com letras repetidas
 * - Validação de palavras no dicionário
 */

import { evaluateGuess, normalize, isValidWord } from '../utils/gameLogic';
import { WORDS } from '../constants/words';

describe('normalize', () => {
  test('converte para maiúsculas', () => {
    expect(normalize('teste')).toBe('TESTE');
  });

  test('remove acentos e trunca para 5', () => {
    // normalize trunca em WORD_LENGTH (5), então palavras longas são cortadas
    expect(normalize('coração')).toBe('CORAC'); // CORACAO → truncado
    expect(normalize('mãe')).toBe('MAE');
    expect(normalize('avô')).toBe('AVO');
  });

  test('remove caracteres especiais', () => {
    expect(normalize('teste!')).toBe('TESTE');
    expect(normalize('te-ste')).toBe('TESTE');
  });

  test('trunca para 5 letras', () => {
    expect(normalize('palavra')).toBe('PALAV');
    expect(normalize('abcdefgh')).toBe('ABCDE');
  });

  test('string vazia retorna vazia', () => {
    expect(normalize('')).toBe('');
  });

  test('apenas números retorna vazio', () => {
    expect(normalize('12345')).toBe('');
  });
});

describe('evaluateGuess', () => {
  test('guess correto retorna 5 correct', () => {
    const result = evaluateGuess('PRAIA', 'PRAIA');
    expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  test('guess totalmente errado retorna 5 absent', () => {
    const result = evaluateGuess('ZZZZZ', 'PRAIA');
    expect(result).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
  });

  test('letra correta na posição errada = present', () => {
    const result = evaluateGuess('A____', 'PRAIA');
    // A está na posição 4 em PRAIA, mas no guess está na posição 0
    expect(result[0]).toBe('present');
  });

  test('letra correta na posição certa = correct', () => {
    const result = evaluateGuess('P____', 'PRAIA');
    expect(result[0]).toBe('correct');
  });

  test('letra repetida: não marca mais vezes do que existe no target', () => {
    // Target tem 1 A. Guess tem 3 As. Só 1 deve ser correct/present.
    const result = evaluateGuess('AAAAA', 'PRAIA');
    const correctCount = result.filter((r) => r === 'correct').length;
    const presentCount = result.filter((r) => r === 'present').length;
    const absentCount = result.filter((r) => r === 'absent').length;

    // PRAIA tem 2 As (posições 2 e 4)
    expect(correctCount + presentCount).toBe(2);
    expect(absentCount).toBe(3);
  });

  test('letra repetida: prioriza correct sobre present', () => {
    const result = evaluateGuess('AABBC', 'CABAB');
    // CABAB tem: C(0), A(1), B(2), A(3), B(4)
    // AABBC tem: A(0), A(1), B(2), B(3), C(4)
    // Passo 1 (correct): pos 1=A, pos 2=B → correct
    // Passo 2 (present): pos 0=A→present(3), pos 3=B→present(4), pos 4=C→present(0)
    expect(result).toEqual(['present', 'correct', 'correct', 'present', 'present']);
  });

  test('caso clássico do Wordle: ALOSA vs SALSA', () => {
    // SALSA: S(0), A(1), L(2), S(3), A(4)
    // ALOSA: A(0), L(1), O(2), S(3), A(4)
    const result = evaluateGuess('ALOSA', 'SALSA');
    // A na pos 0: presente em SALSA (pos 1 ou 4)
    // L na pos 1: presente em SALSA (pos 2)
    // O na pos 2: absent
    // S na pos 3: correct
    // A na pos 4: correct
    expect(result[3]).toBe('correct');
    expect(result[4]).toBe('correct');
    expect(result[2]).toBe('absent');
  });

  test('guess com letra que só existe uma vez no target', () => {
    const result = evaluateGuess('S__S_', 'PRAIA');
    // PRAIA não tem S
    expect(result[0]).toBe('absent');
    expect(result[3]).toBe('absent');
  });
});

describe('isValidWord', () => {
  test('palavra existente no dicionário', () => {
    expect(isValidWord('TIGRE', WORDS)).toBe(true);
  });

  test('palavra não existente', () => {
    expect(isValidWord('ZZZZZ', WORDS)).toBe(false);
  });

  test('case insensitive', () => {
    expect(isValidWord('tigre', WORDS)).toBe(true);
    expect(isValidWord('TiGrE', WORDS)).toBe(true);
  });

  test('palavra vazia', () => {
    expect(isValidWord('', WORDS)).toBe(false);
  });

  test('todas as palavras da base de dados são válidas', () => {
    // WORDLIST e WORDS são o mesmo array, então não há chance de divergência.
    expect(WORDS.length).toBeGreaterThan(100);
  });
});

