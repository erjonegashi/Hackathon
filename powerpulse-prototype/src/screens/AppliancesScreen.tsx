import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import type { Appliance } from '../models/appliance';

function wattsColor(w: number) {
  if (w >= 1500) return '#FF4D6D';
  if (w >= 700) return '#FFD166';
  return '#16BD66';
}

export function AppliancesScreen() {
  const appliances = useAppStore((s) => s.appliances);
  const toggle = useAppStore((s) => s.toggleAppliance);
  const add = useAppStore((s) => s.addAppliance);
  const remove = useAppStore((s) => s.removeAppliance);
  const update = useAppStore((s) => s.updateAppliance);

  const [name, setName] = useState('');
  const [watts, setWatts] = useState('500');

  const sorted = useMemo(
    () => appliances.slice().sort((a, b) => Number(b.isOn) - Number(a.isOn)),
    [appliances]
  );

  const onAdd = () => {
    const w = Number(watts);
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter an appliance name.');
      return;
    }
    if (!Number.isFinite(w) || w <= 0) {
      Alert.alert('Invalid wattage', 'Please enter a valid wattage (W).');
      return;
    }
    add({ name, wattage: w });
    setName('');
    setWatts('500');
  };

  const renderRow = ({ item }: { item: Appliance }) => (
    <Card>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSub}>
            <Text style={{ color: wattsColor(item.wattage), fontWeight: '900' }}>
              {item.wattage}W
            </Text>{' '}
            · Today {Math.round(item.todayMinutes)} min
          </Text>
        </View>
        <Switch
          value={Boolean(item.isOn)}
          onValueChange={() => toggle(item.id)}
          trackColor={{ false: '#22304A', true: 'rgba(22,189,102,0.35)' }}
          thumbColor={item.isOn ? '#16BD66' : '#9DB0D8'}
        />
      </View>

      <View style={styles.controls}>
        <View style={styles.inline}>
          <Text style={styles.smallLabel}>Wattage</Text>
          <TextInput
            value={String(item.wattage)}
            onChangeText={(t) => update(item.id, { wattage: Number(t) })}
            keyboardType="numeric"
            style={styles.smallInput}
            placeholderTextColor="#6E83AD"
          />
        </View>
        <Pressable
          onPress={() =>
            Alert.alert('Remove appliance?', item.name, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', style: 'destructive', onPress: () => remove(item.id) },
            ])
          }
          style={({ pressed }) => [styles.removeBtn, pressed ? { opacity: 0.85 } : null]}
        >
          <Ionicons name="trash" size={16} color="#FF4D6D" />
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
    </Card>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Appliances</Text>
      <Text style={styles.subtitle}>Toggle ON/OFF and manage wattage.</Text>

      <Card style={styles.addCard}>
        <Text style={styles.cardTitle}>Add appliance</Text>
        <View style={styles.addRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.smallLabel}>Name</Text>
            <TextInput
              value={name ?? ''}
              onChangeText={setName}
              placeholder="e.g., Heater"
              placeholderTextColor="#6E83AD"
              style={styles.input}
            />
          </View>
          <View style={{ width: 120 }}>
            <Text style={styles.smallLabel}>W (watts)</Text>
            <TextInput
              value={watts ?? ''}
              onChangeText={setWatts}
              keyboardType="numeric"
              placeholder="500"
              placeholderTextColor="#6E83AD"
              style={styles.input}
            />
          </View>
        </View>
        <Pressable
          onPress={onAdd}
          style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.85 } : null]}
        >
          <Ionicons name="add-circle" size={18} color="#0B1220" />
          <Text style={styles.primaryText}>Add</Text>
        </Pressable>
      </Card>

      <FlatList
        data={sorted}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={renderRow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1220', padding: 16, gap: 12 },
  title: { color: '#EAF0FF', fontSize: 22, fontWeight: '900' },
  subtitle: { color: '#9DB0D8', marginTop: -8 },

  addCard: { gap: 10 },
  cardTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  addRow: { flexDirection: 'row', gap: 10 },
  smallLabel: { color: '#9DB0D8', fontSize: 12, marginBottom: 6, fontWeight: '700' },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#22304A',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#EAF0FF',
    fontWeight: '700',
  },
  primaryBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#4DA3FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryText: { color: '#0B1220', fontWeight: '900' },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemName: { color: '#EAF0FF', fontWeight: '900', fontSize: 15 },
  itemSub: { color: '#7F92B8', marginTop: 4, fontWeight: '600' },
  controls: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  smallInput: {
    minWidth: 80,
    backgroundColor: '#0B1220',
    borderColor: '#22304A',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#EAF0FF',
    fontWeight: '800',
    textAlign: 'center',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.5)',
    backgroundColor: 'rgba(255,77,109,0.12)',
  },
  removeText: { color: '#FF4D6D', fontWeight: '900' },
});

