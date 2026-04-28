import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function ChallengeScreen() {
  const challenge = useAppStore((s) => s.challenge);
  const start = useAppStore((s) => s.startChallenge);
  const tryComplete = useAppStore((s) => s.completeChallengeIfEligible);
  const currentLoad = useAppStore((s) => s.getTotalLoadW());
  const [confetti, setConfetti] = useState(false);

  const targetLoad = useMemo(
    () => Math.max(0, challenge.baselineLoadW - challenge.targetReductionW),
    [challenge.baselineLoadW, challenge.targetReductionW]
  );

  const progress = useMemo(() => {
    if (challenge.status !== 'active') return 0;
    if (challenge.baselineLoadW <= 0) return 0;
    const need = challenge.targetReductionW;
    const reduced = Math.max(0, challenge.baselineLoadW - currentLoad);
    return clamp01(reduced / Math.max(1, need));
  }, [challenge, currentLoad]);

  const savedW = Math.max(0, challenge.baselineLoadW - currentLoad);
  const successNow = currentLoad <= targetLoad && challenge.status === 'active';

  const onStartSaving = () => {
    if (challenge.status === 'idle' || challenge.status === 'failed' || challenge.status === 'success') {
      start();
      return;
    }
    const did = tryComplete();
    if (did) setConfetti(true);
  };

  const statusColor =
    challenge.status === 'success'
      ? '#16BD66'
      : challenge.status === 'failed'
        ? '#FF4D6D'
        : '#FFD166';

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Demand-Response Challenge</Text>
      <Text style={styles.subtitle}>Simulated peak event. Reduce load to earn points.</Text>

      <Card style={styles.hero}>
        <View style={styles.heroRow}>
          <Ionicons name="flash" size={18} color="#4DA3FF" />
          <Text style={styles.heroTitle}>{challenge.title}</Text>
        </View>
        <Text style={styles.desc}>{challenge.description}</Text>

        <View style={styles.metricsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mLabel}>Baseline</Text>
            <Text style={styles.mValue}>{challenge.baselineLoadW.toFixed(0)} W</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mLabel}>Current</Text>
            <Text style={[styles.mValue, { color: currentLoad > targetLoad ? '#FF4D6D' : '#16BD66' }]}>
              {currentLoad.toFixed(0)} W
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mLabel}>Target</Text>
            <Text style={styles.mValue}>{targetLoad.toFixed(0)} W</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.savedText}>
            Saved: <Text style={{ color: '#16BD66', fontWeight: '900' }}>{savedW.toFixed(0)} W</Text>
          </Text>
          <View style={[styles.statusPill, { borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {challenge.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {challenge.status === 'active' ? (
          <Text style={styles.hint}>
            Tip: switch heavy appliances OFF now. If you hit the target, tap “Claim reward”.
          </Text>
        ) : null}
      </Card>

      <Card>
        <Text style={styles.rewardLine}>
          Reward: <Text style={styles.rewardStrong}>{challenge.pointsReward} points</Text> for reducing{' '}
          <Text style={styles.rewardStrong}>{challenge.targetReductionW}W</Text>.
        </Text>
        <Pressable
          onPress={onStartSaving}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed ? { opacity: 0.86 } : null,
            challenge.status === 'active' && !successNow ? styles.primaryBtnWarn : null,
          ]}
        >
          <Ionicons
            name={challenge.status === 'active' ? 'checkmark-circle' : 'play-circle'}
            size={18}
            color="#0B1220"
          />
          <Text style={styles.primaryText}>
            {challenge.status === 'active' ? 'Claim reward' : 'Start Saving'}
          </Text>
        </Pressable>
        {challenge.status === 'active' && !successNow ? (
          <Text style={styles.smallNote}>Not at target yet. Reduce load further.</Text>
        ) : null}
      </Card>

      {confetti ? (
        <ConfettiCannon
          count={90}
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
  screen: { flex: 1, backgroundColor: '#0B1220', padding: 16, gap: 12 },
  title: { color: '#EAF0FF', fontSize: 22, fontWeight: '900' },
  subtitle: { color: '#9DB0D8', marginTop: -8 },
  hero: { gap: 10 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16, flex: 1 },
  desc: { color: '#9DB0D8', fontWeight: '600' },
  metricsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  mLabel: { color: '#7F92B8', fontSize: 12, fontWeight: '700' },
  mValue: { color: '#EAF0FF', fontSize: 18, fontWeight: '900', marginTop: 2 },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#22304A',
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: { height: 10, backgroundColor: '#4DA3FF' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  savedText: { color: '#9DB0D8', fontWeight: '700' },
  statusPill: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  statusText: { fontWeight: '900', fontSize: 12 },
  hint: { color: '#7F92B8', fontWeight: '600' },

  rewardLine: { color: '#9DB0D8', fontWeight: '700' },
  rewardStrong: { color: '#EAF0FF', fontWeight: '900' },
  primaryBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#4DA3FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryBtnWarn: { backgroundColor: '#FFD166' },
  primaryText: { color: '#0B1220', fontWeight: '900' },
  smallNote: { color: '#7F92B8', fontWeight: '600', marginTop: 8 },
});

