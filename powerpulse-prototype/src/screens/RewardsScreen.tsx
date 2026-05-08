import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';

function badgeLabel(id: string) {
  switch (id) {
    case 'starter':
      return 'Starter';
    case 'saver_100':
      return '100 Points';
    case 'streak_3':
      return '3-Day Streak';
    case 'streak_7':
      return '7-Day Streak';
    default:
      return id;
  }
}

export function RewardsScreen() {
  const rewards = useAppStore((s) => s.rewards);
  const [confetti, setConfetti] = useState(false);

  const unlocked = useMemo(
    () => Object.entries(rewards.badges).filter(([, v]) => v).map(([k]) => k),
    [rewards.badges]
  );

  const onCelebrate = () => setConfetti(true);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Rewards</Text>
          <Text style={styles.subtitle}>Points, streaks, and badges.</Text>
        </View>

        <Card style={styles.top}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.metricLabel}>Points</Text>
              <Text style={styles.metricValue}>{rewards.points}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.metricLabel}>Streak</Text>
              <Text style={styles.metricValue}>{rewards.streakDays} days</Text>
            </View>
          </View>

          <Pressable
            onPress={onCelebrate}
            style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.86 } : null]}
          >
            <Ionicons name="sparkles" size={18} color="#0B1220" />
            <Text style={styles.primaryText}>Celebrate milestone</Text>
          </Pressable>

          <Text style={styles.note}>
            You earn points by completing demand-response challenges (Challenge tab).
          </Text>
        </Card>

        <Card style={{ gap: 14 }}>
          <Text style={styles.sectionTitle}>Badges</Text>
          {Object.entries(rewards.badges).map(([id, ok]) => (
            <View key={id} style={styles.badgeRow}>
              <Ionicons name={ok ? 'medal' : 'lock-closed'} size={18} color={ok ? '#FFD166' : '#5A7099'} />
              <Text style={[styles.badgeText, ok ? null : { color: '#5A7099' }]}>{badgeLabel(id)}</Text>
              <Text style={[styles.badgeStatus, ok ? { color: '#16BD66' } : { color: '#5A7099' }]}>
                {ok ? 'Unlocked' : 'Locked'}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <Text style={styles.note}>Unlocked: {unlocked.length}</Text>
        </Card>
      </ScrollView>

      {confetti ? (
        <ConfettiCannon
          count={120}
          origin={{ x: -10, y: 0 }}
          fadeOut
          autoStart
          onAnimationEnd={() => setConfetti(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1220' },
  scrollContent: { padding: 20, gap: 14, paddingBottom: 40 },
  header: { gap: 2 },
  title: { color: '#EAF0FF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: '#5A7099', fontSize: 13, fontWeight: '600' },
  top: { gap: 14 },
  row: { flexDirection: 'row', gap: 10 },
  metricLabel: { color: '#5A7099', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  metricValue: { color: '#EAF0FF', fontSize: 24, fontWeight: '900', marginTop: 4 },
  primaryBtn: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4DA3FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  primaryText: { color: '#0B1220', fontWeight: '900', fontSize: 16 },
  note: { color: '#5A7099', fontWeight: '600', fontSize: 13, lineHeight: 18 },
  sectionTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badgeText: { color: '#EAF0FF', fontWeight: '800', flex: 1, fontSize: 15 },
  badgeStatus: { fontWeight: '900', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#22304A', marginVertical: 4 },
});

