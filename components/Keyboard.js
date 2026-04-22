import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../styles/AppStyles';
import { KEYBOARD_ROWS } from '../constants/words';

function getKeyStyle(state) {
  switch (state) {
    case 'correct': return styles.keyCorrect;
    case 'present': return styles.keyPresent;
    case 'absent': return styles.keyAbsent;
    default: return null;
  }
}

export default function Keyboard({ onKeyPress, letterStates }) {
  return (
    <View style={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, i) => (
        <View key={i} style={styles.keyRow}>
          {row.map((key) => {
            const state = letterStates[key] || null;
            return (
              <Pressable
                key={key}
                onPress={() => onKeyPress(key)}
                style={[styles.key, getKeyStyle(state)]}
                accessibilityLabel={key}
                accessibilityRole="button"
              >
                <Text style={styles.keyText}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
