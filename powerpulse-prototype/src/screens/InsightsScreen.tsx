import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import { applianceEnergyKWh } from '../utils/energy';
import type { Appliance } from '../models/appliance';

type BreakdownItem = { name: string; kWh: number };

function formatEur(v: number) {
  return `€${v.toFixed(2)}`;
}

export function InsightsScreen() {
  const appliances = useAppStore((s: any) => s.appliances);
  const todayKWh = useAppStore((s: any) => s.getTodayKWh());
  const estTodayCost = useAppStore((s: any) => s.getEstimatedCostEurToday());
  const most = useAppStore((s: any) => s.getMostConsumingAppliance());

  const breakdown = useMemo(() => {
    const items: BreakdownItem[] = appliances
      .map((a: Appliance) => ({ name: a.name, kWh: applianceEnergyKWh(a) }))
      .filter((x: BreakdownItem) => x.kWh > 0.0001)
      .sort((a: BreakdownItem, b: BreakdownItem) => b.kWh - a.kWh)
      .slice(0, 6);
    return items;
  }, [appliances]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Daily usage + appliance breakdown.</Text>
        </View>

        <Card style={{ gap: 14 }}>
          <Text style={styles.sectionTitle}>Daily usage (last 7 days)</Text>
          <Text style={styles.note}>
            Today: <Text style={styles.strong}>{todayKWh.toFixed(2)} kWh</Text> · Est cost:{' '}
            <Text style={styles.strong}>{formatEur(estTodayCost)}</Text>
          </Text>
        </Card>

        <Card style={{ gap: 14 }}>
          <Text style={styles.sectionTitle}>Appliance breakdown (today)</Text>
          {breakdown.length ? (
            <View style={{ gap: 8 }}>
              {breakdown.map((b) => (
                <View key={b.name} style={styles.breakdownRow}>
                  <Text style={styles.legend}>{b.name}</Text>
                  <Text style={styles.strong}>{b.kWh.toFixed(2)} kWh</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.note}>No usage yet. Turn appliances ON to generate insights.</Text>
          )}

          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.note}>Most consuming</Text>
            <Text style={styles.strong}>{most?.name ?? '—'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.note}>Est. monthly cost</Text>
            <Text style={styles.strong}>{formatEur(estTodayCost * 30)}</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1220' },
  scrollContent: { padding: 20, gap: 14, paddingBottom: 40 },
  header: { gap: 2 },
  title: { color: '#EAF0FF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: '#5A7099', fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  note: { color: '#5A7099', fontWeight: '600', fontSize: 13 },
  strong: { color: '#EAF0FF', fontWeight: '900', fontSize: 14 },
  legend: { color: '#9DB0D8', fontWeight: '700', flex: 1, fontSize: 14 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#22304A', marginVertical: 8 },
});

