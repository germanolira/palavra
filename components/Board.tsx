import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Tile from './Tile';
import { styles } from '../styles/AppStyles';
import { WORD_LENGTH } from '../constants/words';
import type { BoardRow } from '../types';

interface BoardProps {
  board: BoardRow[];
  flipRowIndex: number;
}

export default function Board({ board, flipRowIndex }: BoardProps) {
  const { width } = useWindowDimensions();
  const tileSize = Math.min(64, (width - 48) / 5);
  const gap = tileSize * 0.15;

  return (
    <View style={[styles.board, { gap }]}>
      {board.map((row, i) => (
        <View key={i} style={[styles.row, { gap }]}>
          {Array.from({ length: WORD_LENGTH }).map((_, j) => (
            <Tile
              key={j}
              letter={row.word[j] || ''}
              state={row.eval[j]}
              index={j}
              animateFlip={flipRowIndex === i}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
