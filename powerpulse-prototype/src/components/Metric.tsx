import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Metric(props: {
  label: string;
  value: string;
  hint?: string;
  color?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{props.label}</Text>
      <Text style={[styles.value, props.color ? { color: props.color } : null]}>
        {props.value}
      </Text>
      {props.hint ? <Text style={styles.hint}>{props.hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { color: '#9DB0D8', fontSize: 12 },
  value: { color: '#EAF0FF', fontSize: 22, fontWeight: '800' },
  hint: { color: '#7F92B8', fontSize: 12 },
});

