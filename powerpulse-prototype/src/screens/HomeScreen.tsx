import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';    
import { Metric } from '../components/Metric';  
import { bestTimeSuggestion, getTariffPeriod } from '../utils/tariffs';

function formatEur(v: number) {
  return `€${v.toFixed(2)}`;
}

export function HomeScreen() {
  const appliances = useAppStore((s) => s.appliances);
  const tickMinute = useAppStore((s) => s.tickMinute);
  const totalLoad = useAppStore((s) => s.getTotalLoadW());
  const todayKWh = useAppStore((s) => s.getTodayKWh());
  const costEur = useAppStore((s) => s.getEstimatedCostEurToday());
  const tariff = useMemo(() => getTariffPeriod(), []);

  const isHighLoad = totalLoad >= 1500;

  const active = useMemo(
    () => appliances.filter((a) => a.isOn).sort((a, b) => b.wattage - a.wattage),
    [appliances]
  );

  useEffect(() => {
    const id = setInterval(() => tickMinute(), 60 * 1000);
    return () => clearInterval(id);
  }, [tickMinute]);

  const ListHeader = (
    <View style={styles.headerContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PowerPulse</Text>
        <Text style={styles.subtitle}>Kosovo Energy Monitor</Text>
      </View>

      {/* Hero load card */}
      <Card style={styles.heroCard}>
        <Text style={styles.heroLabel}>Current Load</Text>
        <Text style={[styles.heroValue, isHighLoad && styles.heroValueHigh]}>
          {totalLoad.toFixed(0)} <Text style={styles.heroUnit}>W</Text>
        </Text>
        <View style={[styles.statusBadge, isHighLoad ? styles.badgeHigh : styles.badgeLow]}>
          <Ionicons
            name={isHighLoad ? 'warning' : 'checkmark-circle'}
            size={13}
            color={isHighLoad ? '#FF4D6D' : '#16BD66'}
          />
          <Text style={[styles.badgeText, isHighLoad ? styles.badgeTextHigh : styles.badgeTextLow]}>
            {isHighLoad ? 'High usage' : 'Low usage'}
          </Text>
        </View>
      </Card>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>{todayKWh.toFixed(2)}</Text>
          <Text style={styles.statUnit}>kWh</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Est. Cost</Text>
          <Text style={styles.statValue}>{formatEur(costEur)}</Text>
          <Text style={styles.statUnit}>today</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Tariff</Text>
          <Text style={styles.statValue}>{tariff === 'day' ? 'DAY' : 'NIGHT'}</Text>
          <Text style={styles.statUnit}>{tariff === 'day' ? '08–23h' : '23–08h'}</Text>
        </Card>
      </View>

      {/* Suggestion */}
      <Text style={styles.suggestion}>{bestTimeSuggestion()}</Text>

      {/* Active appliances section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active appliances</Text>
        <Text style={styles.sectionMeta}>{active.length} ON</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      data={active}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={ListHeader}
      renderItem={({ item }) => (
        <Card style={styles.itemCard}>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSub}>{item.wattage} W</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="power" size={13} color="#16BD66" />
              <Text style={styles.tagText}>ON</Text>
            </View>
          </View>
        </Card>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No active appliances — turn something on in Appliances.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  headerContent: {
    padding: 20,
    gap: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 8,
  },
  itemCard: {},

  header: { gap: 2 },
  title: { color: '#EAF0FF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: '#5A7099', fontSize: 13, fontWeight: '600' },

  /* Hero */
  heroCard: { alignItems: 'center', paddingVertical: 28, gap: 10 },
  heroLabel: { color: '#5A7099', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  heroValue: { color: '#16BD66', fontSize: 52, fontWeight: '900', lineHeight: 58 },
  heroValueHigh: { color: '#FF4D6D' },
  heroUnit: { fontSize: 24, fontWeight: '600' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeLow: { backgroundColor: 'rgba(22,189,102,0.1)', borderColor: 'rgba(22,189,102,0.4)' },
  badgeHigh: { backgroundColor: 'rgba(255,77,109,0.1)', borderColor: 'rgba(255,77,109,0.4)' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeTextLow: { color: '#16BD66' },
  badgeTextHigh: { color: '#FF4D6D' },

  /* Stats */
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 2 },
  statLabel: { color: '#5A7099', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  statValue: { color: '#EAF0FF', fontSize: 18, fontWeight: '900' },
  statUnit: { color: '#5A7099', fontSize: 11, fontWeight: '600' },

  suggestion: { color: '#5A7099', fontSize: 13, fontWeight: '600', textAlign: 'center' },

  /* Section */
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#EAF0FF', fontSize: 15, fontWeight: '800' },
  sectionMeta: { color: '#5A7099', fontSize: 13, fontWeight: '700' },

  /* Items */
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemName: { color: '#EAF0FF', fontWeight: '700', fontSize: 14 },
  itemSub: { color: '#5A7099', fontSize: 13, marginTop: 2 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(22,189,102,0.12)',
    borderColor: 'rgba(22,189,102,0.45)',
    borderWidth: 1,
  },
  tagText: { color: '#16BD66', fontWeight: '800', fontSize: 11 },

  emptyText: { color: '#5A7099', fontWeight: '600', textAlign: 'center', paddingVertical: 12 },
});
