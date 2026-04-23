# PLEASE DO NOT INTERACT WITH THIS FILE OR MODIFY IT IN ANY WAY

Agora tenho clareza do projeto. Vou responder suas 3 dúvidas com base no que vi:

---

### 1) JSON ou TypeScript?

**Recomendo fortemente migrar para TypeScript.** 

Hoje vocês importam `dailySeed.json` diretamente, e isso "funciona", mas tem um problema grave: **não há validação em tempo de compilação.** O compilador não sabe o formato do JSON, então erros de estrutura só explodem no app em runtime.

Exemplo real que já existe no código: **`"BOSQUE"` tem 6 letras** (linha 47 do `dailySeed.json`). Com TS, vocês poderiam ter algo assim:

```ts
export type Difficulty = 'common' | 'medium' | 'rare';

export interface DailySeed {
  baseDate: string;
  words: Array<{
    word: string;
    difficulty: Difficulty;
  }>;
}

export const dailySeed: DailySeed = {
  baseDate: "2026-04-22",
  words: [
    { word: "PRAIA", difficulty: "common" },
    { word: "OSTRA", difficulty: "medium" },
    // ...
  ]
};
```

**Vantagens do TS:**
- Autocomplete no editor
- Erros de tipo em tempo de compilação (nunca mais uma palavra de 4 ou 6 letras passa batido)
- Facilidade de adicionar metadados (dificuldade, frequência, tema)
- Refatoração segura (renomear campos sem medo)

**Quando manter JSON:** Se a lista de palavras viesse de uma API externa ou fosse atualizada por um CMS não-técnico. Como é um arquivo estático no repo, TS é o caminho natural.

---

### 2) Ter testes para validar as palavras?

**Sim, sem dúvida.** E eu diria que isso é *essencial* para um jogo de palavras. O bug do `"BOSQUE"` prova exatamente porquê.

Testes que recomendo ter:

| Teste | Motivo |
|-------|--------|
| Todas as palavras têm exatamente 5 letras | Regra do jogo |
| Todas são únicas (sem duplicatas) | Evita dias repetidos |
| Apenas letras A-Z sem acentos (ou com, dependendo da regra do jogo) | Consistência do teclado |
| `baseDate` é uma data válida (ISO 8601) | Evita crash no cálculo do schedule |
| O schedule de 365 dias nunca repete a palavra do dia anterior | Qualidade da experiência |
| Todas as palavras existem num dicionário pt-BR | Evita palavras inventadas/falsas |
| Distribuição de dificuldade balanceada | Sua ideia da pergunta 3 |

Hoje o projeto **não tem nenhum framework de testes** (não vi Jest, Vitest, etc). Isso seria o primeiro passo: adicionar Jest (ou Vitest) + um teste que importa o seed e valida tudo.

---

### 3) Classificar palavras por frequência/comunidade?

**Sim, excelente ideia.** Um dos problemas dos Wordles genéricos é usarem palavras muito raras que ninguém conhece e geram frustração.

O que eu recomendo:

1. **Adicionar um campo `difficulty`** ou `frequency` no seed de cada palavra.
2. **Distribuição sugerida:**
   - ~60% `common` (palavras do dia-a-dia: PRAIA, LIVRO, AMIGO)
   - ~30% `medium` (conhecidas mas menos óbvias: OSTRA, GRATO, HASTE)
   - ~10% `rare` (mais difíceis, para dar spice: ???)

3. **Usar isso no jogo:**
   - No modo diário, sortear respeitando essa proporção.
   - No futuro, permite ter um modo "Difícil" ou "Clássico" onde o usuário escolhe.

**Como descobrir a frequência?** Vocês podem usar listas de frequência do português (como a do Corpus Brasileiro, ou a lista SUBTLEX-PT). Palavras entre as 1000 mais frequentes = `common`, 1000-5000 = `medium`, >5000 = `rare`.

---

### Resumindo minha recomendação:

1. **Migre o `dailySeed.json` para `dailySeed.ts`** com tipagem forte.
2. **Adicione um framework de testes** e crie testes de sanidade para o seed.
3. **Adicione `difficulty: 'common' | 'medium' | 'rare'`** a cada palavra e valide a distribuição nos testes.
4. **Corrija `"BOSQUE"`** (trocar por uma de 5 letras).

---

Você quer que eu prepare um plano de implementação passo-a-passo para fazer essas 4 mudanças? Posso começar criando o `dailySeed.ts` tipado, os testes de validação, e sugerir substitutos para palavras problemáticas.