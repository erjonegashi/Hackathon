import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function UsagePill(props: { label: string; level: 'low' | 'high' }) {
  const isLow = props.level === 'low';
  const bg = isLow ? 'rgba(22, 189, 102, 0.18)' : 'rgba(255, 77, 109, 0.16)';
  const fg = isLow ? '#16BD66' : '#FF4D6D';
  const icon = isLow ? 'leaf' : 'warning';
  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: fg }]}>
      <Ionicons name={icon} size={14} color={fg} />
      <Text style={[styles.text, { color: fg }]}>{props.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  text: { fontSize: 12, fontWeight: '700' },
});

