import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';

export function OnboardingScreen() {
  const household = useAppStore((s) => s.household);
  const setHousehold = useAppStore((s) => s.setHousehold);

  const [name, setName] = useState(household.name);
  const [members, setMembers] = useState(String(household.members));

  const onSave = () => {
    const m = Number(members);
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a household name.');
      return;
    }
    if (!Number.isFinite(m) || m <= 0) {
      Alert.alert('Invalid members', 'Members must be a positive number.');
      return;
    }
    setHousehold({ name: name.trim(), members: Math.round(m) });
    Alert.alert('Saved', 'Household profile updated.');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Set up your household and start tracking.</Text>

      <Card style={{ gap: 10 }}>
        <Text style={styles.cardTitle}>Household profile</Text>

        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="My Home"
            placeholderTextColor="#6E83AD"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Members</Text>
          <TextInput
            value={members}
            onChangeText={setMembers}
            keyboardType="numeric"
            placeholder="3"
            placeholderTextColor="#6E83AD"
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={onSave}
          style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.86 } : null]}
        >
          <Ionicons name="checkmark-circle" size={18} color="#0B1220" />
          <Text style={styles.primaryText}>Save</Text>
        </Pressable>

        <Text style={styles.note}>
          Appliances are preloaded (washing machine, dishwasher, refrigerator, etc.) and can be edited
          anytime from the Appliances tab.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1220', padding: 16, gap: 12 },
  title: { color: '#EAF0FF', fontSize: 22, fontWeight: '900' },
  subtitle: { color: '#9DB0D8', marginTop: -8 },
  cardTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  label: { color: '#9DB0D8', fontSize: 12, marginBottom: 6, fontWeight: '700' },
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
    marginTop: 6,
  },
  primaryText: { color: '#0B1220', fontWeight: '900' },
  note: { color: '#7F92B8', fontWeight: '600', marginTop: 2 },
});

