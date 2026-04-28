import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export function Card(props: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F1A30',
    borderColor: '#22304A',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
});

