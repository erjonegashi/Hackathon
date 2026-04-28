import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import { Metric } from '../components/Metric';
import { UsagePill } from '../components/UsagePill';
import { bestTimeSuggestion, getTariffPeriod } from '../utils/tariffs';

function formatEur(v: number) {
  return `€${v.toFixed(2)}`;
}

function usageLevelFromLoad(loadW: number) {
  // Simple heuristic for the prototype.
  if (loadW >= 1500) return 'high' as const;
  return 'low' as const;
}

export function HomeScreen() {
  const appliances = useAppStore((s) => s.appliances);
  const tickMinute = useAppStore((s) => s.tickMinute);
  const totalLoad = useAppStore((s) => s.getTotalLoadW());
  const todayKWh = useAppStore((s) => s.getTodayKWh());
  const costEur = useAppStore((s) => s.getEstimatedCostEurToday());
  const tariff = useMemo(() => getTariffPeriod(), []);

  const active = useMemo(
    () => appliances.filter((a) => a.isOn).sort((a, b) => b.wattage - a.wattage),
    [appliances]
  );

  const pillLevel = usageLevelFromLoad(totalLoad);

  useEffect(() => {
    // Simulate time passing while the app is open.
    const id = setInterval(() => tickMinute(), 60 * 1000);
    return () => clearInterval(id);
  }, [tickMinute]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>PowerPulse Kosovo</Text>
      <Text style={styles.subtitle}>Save power. Earn points. Beat peak events.</Text>

      <Card style={styles.banner}>
        <View style={styles.bannerRow}>
          <Ionicons name="alert-circle" size={18} color="#FFD166" />
          <Text style={styles.bannerText}>
            Peak Alert (mock): reduce load during 19:00–20:00.
          </Text>
        </View>
      </Card>

      <Card style={styles.kpis}>
        <View style={styles.kpiRow}>
          <Metric
            label="Current load"
            value={`${totalLoad.toFixed(0)} W`}
            color={pillLevel === 'high' ? '#FF4D6D' : '#16BD66'}
            hint="Live from active appliances"
          />
          <UsagePill
            label={pillLevel === 'high' ? 'High usage' : 'Low usage'}
            level={pillLevel}
          />
        </View>

        <View style={styles.kpiGrid}>
          <Card style={styles.kpiMini}>
            <Metric label="Today" value={`${todayKWh.toFixed(2)} kWh`} hint="Simulated" />
          </Card>
          <Card style={styles.kpiMini}>
            <Metric label="Est. cost" value={formatEur(costEur)} hint="Tariff + blocks" />
          </Card>
          <Card style={styles.kpiMini}>
            <Metric
              label="Tariff"
              value={tariff === 'day' ? 'DAY' : 'NIGHT'}
              hint={tariff === 'day' ? '08:00–23:00' : '23:00–08:00'}
            />
          </Card>
        </View>

        <Text style={styles.suggestion}>{bestTimeSuggestion()}</Text>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active appliances</Text>
        <Text style={styles.sectionMeta}>{active.length} ON</Text>
      </View>

      <FlatList
        data={active}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.wattage} W</Text>
              </View>
              <View style={styles.tag}>
                <Ionicons name="power" size={14} color="#16BD66" />
                <Text style={styles.tagText}>ON</Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <Card>
            <Text style={styles.emptyText}>
              No active appliances. Turn something ON in Appliances.
            </Text>
          </Card>
        }
      />

      <Pressable
        onPress={() => {
          // Quick UX: pretend the tariff label should be refreshed. (Tariff is time-based.)
        }}
        style={({ pressed }) => [styles.fab, pressed ? { opacity: 0.85 } : null]}
      >
        <Ionicons name="refresh" size={18} color="#0B1220" />
        <Text style={styles.fabText}>Refresh</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1220',
    padding: 16,
    gap: 12,
  },
  title: { color: '#EAF0FF', fontSize: 24, fontWeight: '900' },
  subtitle: { color: '#9DB0D8', marginTop: -8 },
  banner: { borderColor: 'rgba(255, 209, 102, 0.45)' },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bannerText: { color: '#EAF0FF', flex: 1, fontWeight: '600' },

  kpis: { gap: 12 },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kpiGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  kpiMini: { flexGrow: 1, flexBasis: '30%', padding: 12 },
  suggestion: { color: '#7F92B8', marginTop: 2, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sectionTitle: { color: '#EAF0FF', fontSize: 16, fontWeight: '800' },
  sectionMeta: { color: '#7F92B8', fontWeight: '700' },

  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemName: { color: '#EAF0FF', fontWeight: '800', fontSize: 15 },
  itemSub: { color: '#7F92B8', marginTop: 3 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(22, 189, 102, 0.14)',
    borderColor: 'rgba(22, 189, 102, 0.5)',
    borderWidth: 1,
  },
  tagText: { color: '#16BD66', fontWeight: '900', fontSize: 12 },
  emptyText: { color: '#9DB0D8', fontWeight: '600' },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4DA3FF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(77, 163, 255, 0.6)',
  },
  fabText: { color: '#0B1220', fontWeight: '900' },
});

