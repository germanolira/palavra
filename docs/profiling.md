# Startup Performance Profiling

## O que foi adicionado

Logs de timing instrumentados em `App.tsx` que medem cada fase do boot:

| Log | O que mede |
|-----|-----------|
| `[BOOT] Fonts loaded in Xms` | Tempo até `useFonts` retornar `true` |
| `[BOOT] bootApp started` | Início da função `bootApp` |
| `[BOOT] Settings read in Xms` | Tempo de leitura do AsyncStorage (settings) |
| `[BOOT] loadDailyWord completed in Xms` | Tempo de leitura do AsyncStorage (guesses) + geração da palavra |
| `[BOOT] Total bootApp time: Xms` | Tempo total da função `bootApp` |
| `[BOOT] Total startup time (from App mount): Xms` | Tempo desde montagem do App até `ready` |
| `[BOOT] First content render: Xms` | Tempo total até o usuário ver a tela real (fonts + bootApp) |

## Como ver os logs

### 1. Metro (terminal onde roda `npx expo start`)
Os logs `[BOOT]` aparecem automaticamente no terminal.

### 2. Android nativo (logcat)
Se estiver rodando build nativa:
```bash
# Filtro apenas para nossos logs
adb logcat -s ReactNativeJS:D | findstr "[BOOT]"

# Ou no PowerShell
adb logcat -s ReactNativeJS:D | Select-String "\[BOOT\]"
```

### 3. Android Studio
- Aba **Logcat**
- Filtro: `tag:ReactNativeJS message:"[BOOT]"`

### 4. Para ver tempo total do sistema (inclui nativo antes do JS)
```bash
adb logcat -d | findstr "Displayed"
```
Procura por:
```
ActivityManager: Displayed com.howdy.palavra/.MainActivity: +XXXXms
```
Esse é o tempo real que o Android mede desde o tap no ícone até a Activity estar visível.

## O que esperar (benchmarks de referência)

| Fase | Tempo esperado (bom) | Tempo preocupante |
|------|---------------------|-------------------|
| Fonts | 200-600ms | >1000ms |
| Settings AsyncStorage | 10-50ms | >200ms |
| loadDailyWord (guesses) | 10-100ms | >300ms |
| Total bootApp | 50-300ms | >500ms |
| First content render | 300-800ms | >1500ms |
| ActivityManager Displayed | 500-1500ms | >3000ms |

## Como interpretar

- Se **Fonts** > 1s → reduzir variantes carregadas no boot
- Se **Settings read** > 200ms → AsyncStorage lento (pode ser cold start)
- Se **loadDailyWord** > 300ms → guesses salvos muito grandes ou storage lento
- Se **ActivityManager Displayed** >> **First content render** → problema no nativo (splas screen demorando, native modules pesadas carregando)

## Limpar logs depois

Quando terminar de medir, remova os logs temporários de `App.tsx` para não poluir produção.
