import React from "react";
import { View, useWindowDimensions } from "react-native";

import type { AppTheme } from "../constants/theme";
import { MAX_GUESSES, WORD_LENGTH } from "../constants/words";
import { useAppStyles } from "../styles/AppStyles";
import type { BoardRow } from "../types";
import Tile from "./Tile";

interface BoardProps {
  board: BoardRow[];
  flipRowIndex: number;
  maxHeight: number;
  won: boolean;
  theme: AppTheme;
  activeRowIndex: number;
  cursorPos: number;
  onTilePress: (index: number) => void;
}

function Board({ board, flipRowIndex, maxHeight, won, theme, activeRowIndex, cursorPos, onTilePress }: BoardProps) {
  const styles = useAppStyles(theme);
  const { width } = useWindowDimensions();

  const { tileSize, gap } = React.useMemo(() => {
    const GAP_RATIO = 0.15;

    let size: number;
    if (maxHeight > 10) {
      const tileByWidth = (width - 48) / (WORD_LENGTH + (WORD_LENGTH - 1) * GAP_RATIO);
      const tileByHeight = maxHeight / (MAX_GUESSES + (MAX_GUESSES - 1) * GAP_RATIO);
      size = Math.min(64, Math.floor(Math.min(tileByWidth, tileByHeight)));
    } else {
      size = Math.min(64, Math.floor((width - 48) / WORD_LENGTH));
    }

    size = Math.max(28, size);
    return { tileSize: size, gap: size * GAP_RATIO };
  }, [maxHeight, width]);

  return (
    <View style={[styles.board, { gap }]}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { gap }]}>
          {Array.from({ length: WORD_LENGTH }).map((_, columnIndex) => (
            <Tile
              key={columnIndex}
              letter={row.letters?.[columnIndex] ?? row.word[columnIndex] ?? ""}
              state={row.eval[columnIndex]}
              index={columnIndex}
              animateFlip={flipRowIndex === rowIndex}
              celebrate={won && flipRowIndex === rowIndex}
              tileSize={tileSize}
              theme={theme}
              cursorActive={rowIndex === activeRowIndex && columnIndex === cursorPos}
              onPress={rowIndex === activeRowIndex ? () => onTilePress(columnIndex) : undefined}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default React.memo(Board);
