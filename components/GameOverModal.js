import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../styles/AppStyles';

export default function GameOverModal({ won, target, onRestart }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>
          {won ? '🎉 Parabéns!' : '😢 Fim de jogo'}
        </Text>
        <Text style={styles.modalText}>
          {won
            ? 'Você acertou a palavra!'
            : 'A palavra correta era:'}
        </Text>
        <Text style={styles.modalWord}>{target}</Text>
        <Pressable onPress={onRestart} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Jogar novamente</Text>
        </Pressable>
      </View>
    </View>
  );
}
