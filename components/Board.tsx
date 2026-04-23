import React from "react";
import { View, useWindowDimensions } from "react-native";

import type { AppTheme } from "../constants/theme";
import { MAX_GUESSES, WORD_LENGTH } from "../constants/words";
import { createAppStyles } from "../styles/AppStyles";
import type { BoardRow } from "../types";
import Tile from "./Tile";

interface BoardProps {
  board: BoardRow[];
  flipRowIndex: number;
  maxHeight: number;
  theme: AppTheme;
}

export default function Board({ board, flipRowIndex, maxHeight, theme }: BoardProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);
  const { width } = useWindowDimensions();

  const GAP_RATIO = 0.15;

  let tileSize: number;
  if (maxHeight > 10) {
    const tileByWidth = (width - 48) / (WORD_LENGTH + (WORD_LENGTH - 1) * GAP_RATIO);
    const tileByHeight = maxHeight / (MAX_GUESSES + (MAX_GUESSES - 1) * GAP_RATIO);
    tileSize = Math.min(64, Math.floor(Math.min(tileByWidth, tileByHeight)));
  } else {
    tileSize = Math.min(64, Math.floor((width - 48) / WORD_LENGTH));
  }

  tileSize = Math.max(28, tileSize);
  const gap = tileSize * GAP_RATIO;

  return (
    <View style={[styles.board, { gap }]}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { gap }]}>
          {Array.from({ length: WORD_LENGTH }).map((_, columnIndex) => (
            <Tile
              key={columnIndex}
              letter={row.word[columnIndex] || ""}
              state={row.eval[columnIndex]}
              index={columnIndex}
              animateFlip={flipRowIndex === rowIndex}
              tileSize={tileSize}
              theme={theme}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
