import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import { applianceEnergyKWh, todayEnergyKWh } from '../utils/energy';
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

  const width = Dimensions.get('window').width;

  const breakdown = useMemo(() => {
    const items: BreakdownItem[] = appliances
      .map((a: Appliance) => ({ name: a.name, kWh: applianceEnergyKWh(a) }))
      .filter((x: BreakdownItem) => x.kWh > 0.0001)
      .sort((a: BreakdownItem, b: BreakdownItem) => b.kWh - a.kWh)
      .slice(0, 6);
    return items;
  }, [appliances]);

  const pieData = useMemo(() => {
    const colors = ['#4DA3FF', '#16BD66', '#FFD166', '#FF4D6D', '#9B5DE5', '#00BBF9'];
    return breakdown.map((b, i) => ({
      key: b.name,
      value: b.kWh,
      svg: { fill: colors[i % colors.length] },
    }));
  }, [breakdown]);

  const last7 = useMemo(() => {
    // Prototype: generate a simple "daily usage" series based on today's usage
    // to show the chart behavior without backend data.
    const base = Math.max(0.4, todayEnergyKWh(appliances));
    const days = Array.from({ length: 7 }, (_, i) => {
      const jitter = (Math.sin(i * 1.2) + 1) * 0.15; // 0..0.3
      return Number((base * (0.8 + jitter)).toFixed(2));
    });
    return days;
  }, [appliances]);

  const chartHeight = 150;
  const contentWidth = width - 32;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Insights</Text>
      <Text style={styles.subtitle}>Daily usage + appliance breakdown.</Text>

      <Card style={{ gap: 10 }}>
        <Text style={styles.sectionTitle}>Daily usage (last 7 days)</Text>
        <Text style={styles.note}>
          Today: <Text style={styles.strong}>{todayKWh.toFixed(2)} kWh</Text> · Est cost:{' '}
          <Text style={styles.strong}>{formatEur(estTodayCost)}</Text>
        </Text>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.sectionTitle}>Appliance breakdown (today)</Text>
        {breakdown.length ? (
          <View style={{ gap: 6 }}>
            {breakdown.map((b) => (
              <Text key={b.name} style={styles.legend}>
                {b.name}: <Text style={styles.strong}>{b.kWh.toFixed(2)} kWh</Text>
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.note}>No usage yet. Turn appliances ON to generate insights.</Text>
        )}

        <Text style={styles.note}>
          Most consuming: <Text style={styles.strong}>{most?.name ?? '—'}</Text>
        </Text>
        <Text style={styles.note}>
          Estimated monthly cost (rough):{' '}
          <Text style={styles.strong}>{formatEur(estTodayCost * 30)}</Text>
        </Text>
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
  strong: { color: '#EAF0FF', fontWeight: '900' },
  legend: { color: '#9DB0D8', fontWeight: '700' },
});

