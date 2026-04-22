import React from 'react';
import { View } from 'react-native';
import Tile from './Tile';
import { styles } from '../styles/AppStyles';
import { WORD_LENGTH } from '../constants/words';

export default function Board({ board }) {
  return (
    <View style={styles.board}>
      {board.map((row, i) => (
        <View key={i} style={styles.row}>
          {Array.from({ length: WORD_LENGTH }).map((_, j) => (
            <Tile
              key={j}
              letter={row.word[j] || ''}
              state={row.eval[j]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
