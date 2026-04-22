import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/AppStyles';

export default function Tile({ letter, state }) {
  return (
    <View style={[styles.tile, styles[state] || styles.empty]}>
      <Text style={styles.tileText}>{letter}</Text>
    </View>
  );
}
