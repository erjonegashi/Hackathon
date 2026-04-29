import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import { TARIFFS } from '../utils/tariffs';

export function SettingsScreen() {
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);
  const resetAll = useAppStore((s) => s.resetAll);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Tariffs, notifications, and reset.</Text>

      <Card style={{ gap: 10 }}>
        <Text style={styles.sectionTitle}>Kosovo tariffs (hardcoded)</Text>
        <Text style={styles.note}>
          Day (08:00–23:00): 0–800 kWh €{TARIFFS.day.firstBlockEurPerKWh}/kWh · &gt;800 kWh €
          {TARIFFS.day.secondBlockEurPerKWh}/kWh
        </Text>
        <Text style={styles.note}>
          Night (23:00–08:00): 0–800 kWh €{TARIFFS.night.firstBlockEurPerKWh}/kWh · &gt;800 kWh €
          {TARIFFS.night.secondBlockEurPerKWh}/kWh
        </Text>
      </Card>

      <Card style={styles.rowCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Notifications (mock)</Text>
          <Text style={styles.note}>Peak alerts and saving reminders.</Text>
        </View>
        <Switch
          value={Boolean(notificationsEnabled)}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#22304A', true: 'rgba(77,163,255,0.35)' }}
          thumbColor={notificationsEnabled ? '#4DA3FF' : '#9DB0D8'}
        />
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.sectionTitle}>Danger zone</Text>
        <Pressable
          onPress={() =>
            Alert.alert('Reset all data?', 'This clears appliances, rewards, and challenges.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
            ])
          }
          style={({ pressed }) => [styles.resetBtn, pressed ? { opacity: 0.86 } : null]}
        >
          <Ionicons name="refresh" size={18} color="#FF4D6D" />
          <Text style={styles.resetText}>Reset app data</Text>
        </Pressable>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1220', padding: 16, gap: 12 },
  title: { color: '#EAF0FF', fontSize: 22, fontWeight: '900' },
  subtitle: { color: '#9DB0D8', marginTop: -8 },
  sectionTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  note: { color: '#7F92B8', fontWeight: '600' },
  rowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resetBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.5)',
    backgroundColor: 'rgba(255,77,109,0.12)',
  },
  resetText: { color: '#FF4D6D', fontWeight: '900' },
});

