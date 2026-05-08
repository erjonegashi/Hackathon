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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import type { Appliance } from '../models/appliance';

function wattsColor(w: number) {
  if (w >= 1500) return '#FF4D6D';
  if (w >= 700) return '#FFD166';
  return '#16BD66';
}

export function AppliancesScreen() {
  const user = useAppStore((s) => s.user);
  const appliances = useAppStore((s) => s.appliances);
  const toggle = useAppStore((s) => s.toggleAppliance);
  const add = useAppStore((s) => s.addAppliance);
  const remove = useAppStore((s) => s.removeAppliance);
  const update = useAppStore((s) => s.updateAppliance);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [watts, setWatts] = useState('500');

  const sorted = useMemo(
    () => appliances.slice().sort((a, b) => Number(b.isOn) - Number(a.isOn)),
    [appliances]
  );

  const requireAuth = (action: () => void) => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    action();
  };

  const onAdd = () => {
    requireAuth(() => {
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
    });
  };

  const onRemove = (item: Appliance) => {
    requireAuth(() => {
      const message = `Are you sure you want to remove ${item.name}?`;
      if (Platform.OS === 'web') {
        if (window.confirm(message)) {
          remove(item.id);
        }
      } else {
        Alert.alert('Remove appliance?', message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => remove(item.id) },
        ]);
      }
    });
  };

  const renderRow = ({ item }: { item: Appliance }) => (
    <Card style={styles.itemCard}>
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemSub}>
            <Text style={{ color: wattsColor(item.wattage), fontWeight: '900' }}>
              {item.wattage}W
            </Text>{' '}
            · Today {Math.round(item.todayMinutes)} min
          </Text>
        </View>
        <Switch
          value={Boolean(item.isOn)}
          onValueChange={() => requireAuth(() => toggle(item.id))}
          trackColor={{ false: '#22304A', true: 'rgba(22,189,102,0.35)' }}
          thumbColor={item.isOn ? '#16BD66' : '#9DB0D8'}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.controls}>
        <View style={styles.wattageControl}>
          <Text style={styles.smallLabel}>Wattage</Text>
          <TextInput
            value={String(item.wattage)}
            onChangeText={(t) => requireAuth(() => update(item.id, { wattage: Number(t) }))}
            keyboardType="numeric"
            style={styles.smallInput}
            placeholderTextColor="#6E83AD"
            editable={!!user}
          />
        </View>
        
        <Pressable
          onPress={() => onRemove(item)}
          style={({ pressed }) => [styles.removeBtn, pressed ? { opacity: 0.7 } : null]}
        >
          <Ionicons name="trash-outline" size={18} color="#FF4D6D" />
        </Pressable>
      </View>
    </Card>
  );

  const ListHeader = (
    <View style={styles.headerContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Appliances</Text>
        <Text style={styles.subtitle}>Toggle ON/OFF and manage wattage.</Text>
      </View>

      {!user && (
        <Card style={styles.loginBanner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="lock-closed" size={20} color="#FFD166" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Unlock Full Control</Text>
            <Text style={styles.bannerText}>Log in to add appliances and manage your usage.</Text>
            <Pressable 
              onPress={() => navigation.navigate('Login')}
              style={({ pressed }) => [styles.bannerBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.bannerBtnText}>Log In / Register</Text>
            </Pressable>
          </View>
        </Card>
      )}

      <Card style={[styles.addCard, !user && { opacity: 0.6 }]}>
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
              editable={!!user}
            />
          </View>
          <View style={{ width: 100 }}>
            <Text style={styles.smallLabel}>Watts</Text>
            <TextInput
              value={watts ?? ''}
              onChangeText={setWatts}
              keyboardType="numeric"
              placeholder="500"
              placeholderTextColor="#6E83AD"
              style={styles.input}
              editable={!!user}
            />
          </View>
        </View>
        <Pressable
          onPress={onAdd}
          style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.85 } : null]}
        >
          <Ionicons name="add-circle" size={18} color="#0B1220" />
          <Text style={styles.primaryText}>Add Appliance</Text>
        </Pressable>
      </Card>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your appliances</Text>
        <Text style={styles.sectionMeta}>{appliances.length} Total</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={sorted}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1220' },
  headerContent: { padding: 20, gap: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 10 },
  header: { gap: 2 },
  title: { color: '#EAF0FF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: '#5A7099', fontSize: 13, fontWeight: '600' },

  loginBanner: {
    backgroundColor: 'rgba(255, 209, 102, 0.05)',
    borderColor: 'rgba(255, 209, 102, 0.2)',
    flexDirection: 'row',
    gap: 16,
    padding: 20,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 209, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: { color: '#FFD166', fontSize: 16, fontWeight: '900' },
  bannerText: { color: '#9DB0D8', fontSize: 13, marginTop: 4, lineHeight: 18, fontWeight: '600' },
  bannerBtn: {
    backgroundColor: '#FFD166',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  bannerBtnText: { color: '#0B1220', fontWeight: '900', fontSize: 14 },

  addCard: { gap: 12 },
  cardTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  addRow: { flexDirection: 'row', gap: 10 },
  smallLabel: { color: '#5A7099', fontSize: 11, marginBottom: 6, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#22304A',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#EAF0FF',
    fontWeight: '700',
  },
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
  },
  primaryText: { color: '#0B1220', fontWeight: '900', fontSize: 16 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  sectionTitle: { color: '#EAF0FF', fontSize: 16, fontWeight: '900' },
  sectionMeta: { color: '#5A7099', fontWeight: '700', fontSize: 13 },

  itemCard: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemName: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  itemSub: { color: '#5A7099', marginTop: 4, fontWeight: '600', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#22304A', marginVertical: 12 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wattageControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  smallInput: {
    width: 70,
    backgroundColor: '#0B1220',
    borderColor: '#22304A',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: '#EAF0FF',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 14,
  },
  removeBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,77,109,0.1)',
    borderColor: 'rgba(255,77,109,0.2)',
    borderWidth: 1,
  },
});

