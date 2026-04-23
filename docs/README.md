# Documentação do Palavra

## Visão Geral
O **Palavra** é um jogo de adivinhação de palavras para dispositivos móveis, inspirado no Wordle, desenvolvido com React Native e Expo. O objetivo é adivinhar a palavra secreta de 5 letras em até 6 tentativas.

### Características Principais
- Jogo diário com palavra fixa por dia
- Feedback visual com cores indicando acertos (verde), letras presentes (laranja) e letras ausentes (cinza)
- Animações de flip nas tiles e shake para erros
- Teclado interativo com feedback háptico
- Temas claro e escuro
- Persistência de progresso e configurações via AsyncStorage

## Arquitetura do Projeto
O projeto segue uma arquitetura modular, separando responsabilidades em diferentes diretórios:

### Entry Point
- `index.tsx`: Registra o aplicativo principal com o `SafeAreaProvider` do `react-native-safe-area-context`.

### Aplicativo Principal
- `App.tsx`: Gerencia todo o estado do jogo, incluindo:
  - Palavra do dia e progresso das tentativas
  - Temas (claro/escuro) e configurações de haptics
  - Lógica de entrada do teclado e validação de palavras
  - Modais (configurações, tutorial, fim de jogo)
  - Persistência de dados no AsyncStorage

## Bibliotecas e Dependências

### Principais (Production)
| Biblioteca | Versão | Propósito |
|------------|--------|-----------|
| `expo` | ~54.0.33 | Framework base para React Native |
| `react` | 19.1.0 | Biblioteca principal de UI |
| `react-native` | 0.81.5 | Framework mobile |
| `react-native-reanimated` | ~4.1.1 | Animações fluidas (flip de tiles, shake, teclado) |
| `react-native-paper` | 4.9.2 | Componentes de UI prontos |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistência local de dados |
| `expo-haptics` | ~15.0.8 | Feedback tátil |
| `@expo-google-fonts/be-vietnam-pro` | * | Tipografia personalizada |
| `@expo/vector-icons` | ^15.0.3 | Ícones |
| `react-native-safe-area-context` | ^5.7.0 | Gerenciamento de áreas seguras |
| `react-native-worklets` | 0.5.1 | Multithreading |

### Desenvolvimento (DevDependencies)
- `typescript` ^6.0.3
- `jest` ^29.7.0
- `jest-expo` ^55.0.16
- `@types/jest`, `@types/react`, `@types/react-native`

## Estrutura de Pastas
```
palavra/
├── assets/                # Recursos estáticos (imagens, fontes)
├── components/            # Componentes React da interface
│   ├── Board.tsx         # Tabuleiro do jogo
│   ├── Tile.tsx          # Célula individual do tabuleiro
│   ├── Keyboard.tsx      # Teclado virtual
│   ├── SettingsModal.tsx # Modal de configurações
│   ├── TutorialModal.tsx # Modal de instruções
│   ├── GameOverModal.tsx # Modal de fim de jogo
│   ├── VictoryScreen.tsx # Tela de vitória
│   ├── Confetti.tsx      # Animação de confete
│   └── BottomSheetModal.tsx # Modal base estilo bottom sheet
├── constants/            # Constantes do projeto
│   ├── theme.ts          # Definições de temas (claro/escuro)
│   └── words.ts         # Configurações de palavras (tamanho, máximo de tentativas)
├── data/                 # Dados estáticos
│   ├── wordlist.ts       # Lista completa de palavras válidas
│   ├── wordlist.ts       # Lista completa de 5374 palavras válidas (WORDLIST)
│   └── dailySeed.ts      # Seed diário (base date, palavras com dificuldade e tags)
├── hooks/                # Hooks customizados
│   └── useTheme.ts       # Hook para gerenciamento de tema
├── scripts/              # Scripts utilitários
│   └── processNewWordlist.js # Processa nova lista de palavras
├── services/             # Serviços de negócio
│   └── dailyWordStorage.ts # Lógica para obter a palavra do dia baseada em data
├── styles/               # Estilos globais
│   └── AppStyles.ts     # Função que gera estilos baseados no tema atual
├── types/                # Definições de tipos TypeScript
│   └── index.ts         # Tipos para tiles, teclado, palavras
├── utils/                # Funções utilitárias
│   └── gameLogic.ts     # Lógica do jogo (normalização, avaliação de palpites)
├── App.tsx               # Componente principal do aplicativo
├── index.tsx             # Ponto de entrada do aplicativo
└── package.json          # Configurações do projeto e dependências
```

## Mecânica do Jogo
1. **Palavra do Dia**: Definida pelo arquivo `data/dailySeed.ts` com data base `2026-04-22`. O `services/dailyWordStorage.ts` calcula a palavra correta com base na data atual.
2. **Tentativas**: Máximo de 6 palpites (`MAX_GUESSES = 6`) para palavras de 5 letras (`WORD_LENGTH = 5`).
3. **Validação**:
   - `utils/gameLogic.ts` normaliza palpites (remove acentos, converte para uppercase).
   - `evaluateGuess()`: Retorna o estado de cada letra: `correct` (posição correta), `present` (letra existe na palavra mas posição errada), `absent` (letra não existe na palavra).
4. **Feedback**:
   - Tiles animam com flip ao confirmar palpite.
   - Teclado mostra cores das letras já utilizadas.
   - Erros disparam animação de shake e feedback háptico.
5. **Fim de Jogo**: Ao acertar ou esgotar tentativas, exibe a palavra correta e contador para próxima palavra.

## Temas e Personalização
- **Temas**: `LIGHT_THEME` e `DARK_THEME` definidos em `constants/theme.ts`.
- **Configurações**: Modal `SettingsModal.tsx` permite alternar entre temas e ativar/desativar haptics.
- **Persistência**: Configurações e progresso salvas no AsyncStorage (`@react-native-async-storage/async-storage`).

## Scripts Disponíveis
| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento Expo |
| `npm run android` | Executa no emulador/smartphone Android |
| `npm run ios` | Executa no simulador iOS |
| `npm run web` | Executa no navegador web |
| `npm test` | Executa testes com Jest |
| `node scripts/processNewWordlist.js` | Processa nova lista de palavras do GitHub |

## Caminhos Importantes
- **Palavra do dia**: `services/dailyWordStorage.ts` → `getWordForDate()`
- **Lógica do jogo**: `utils/gameLogic.ts`
- **Estilos**: `styles/AppStyles.ts` (função `createAppStyles(theme)`)
- **Tipos**: `types/index.ts` (TileState, LetterStates, BoardRow)
- **Dados de palavras**: `data/wordlist.ts` (5374 palavras), `data/dailySeed.ts`
