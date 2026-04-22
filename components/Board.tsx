import React from "react";
import { View, useWindowDimensions } from "react-native";

import type { AppTheme } from "../constants/theme";
import { WORD_LENGTH } from "../constants/words";
import { createAppStyles } from "../styles/AppStyles";
import type { BoardRow } from "../types";
import Tile from "./Tile";

interface BoardProps {
  board: BoardRow[];
  flipRowIndex: number;
  theme: AppTheme;
}

export default function Board({ board, flipRowIndex, theme }: BoardProps) {
  const styles = React.useMemo(() => createAppStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const tileSize = Math.min(64, (width - 48) / 5);
  const gap = tileSize * 0.15;

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
              theme={theme}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
