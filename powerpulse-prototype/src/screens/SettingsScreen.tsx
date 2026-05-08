import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import { TARIFFS } from '../utils/tariffs';
import type { RootStackParamList } from '../navigation/types';

export function SettingsScreen() {
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);
  const resetAll = useAppStore((s) => s.resetAll);
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Account, tariffs, and preferences.</Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#4DA3FF" />
          </View>
          <View style={{ flex: 1 }}>
            {user ? (
              <>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
                <Pressable 
                  onPress={logout}
                  style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
                >
                  <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.profileName}>Guest User</Text>
                <Text style={styles.profileEmail}>Sign in to save your data</Text>
                <Pressable 
                  onPress={() => navigation.navigate('Login')}
                  style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.8 }]}
                >
                  <Text style={styles.loginBtnText}>Log In / Register</Text>
                </Pressable>
              </>
            )}
          </View>
        </Card>

        <Card style={{ gap: 14 }}>
          <Text style={styles.sectionTitle}>Kosovo Tariffs</Text>
          <View style={styles.tariffRow}>
            <Text style={styles.note}>
              Day <Text style={styles.time}>(08:00–23:00)</Text>
            </Text>
            <Text style={styles.strong}>€{TARIFFS.day.firstBlockEurPerKWh} / kWh</Text>
          </View>
          <View style={styles.tariffRow}>
            <Text style={styles.note}>
              Night <Text style={styles.time}>(23:00–08:00)</Text>
            </Text>
            <Text style={styles.strong}>€{TARIFFS.night.firstBlockEurPerKWh} / kWh</Text>
          </View>
          <Text style={styles.smallNote}>* Tariffs include progressive block pricing (0-800+ kWh).</Text>
        </Card>

        <Card style={styles.rowCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.note}>Peak alerts and saving reminders.</Text>
          </View>
          <Switch
            value={Boolean(notificationsEnabled)}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#22304A', true: 'rgba(77,163,255,0.35)' }}
            thumbColor={notificationsEnabled ? '#4DA3FF' : '#9DB0D8'}
          />
        </Card>

        <Card style={{ gap: 14 }}>
          <Text style={[styles.sectionTitle, { color: '#FF4D6D' }]}>Danger Zone</Text>
          <Pressable
            onPress={() =>
              Alert.alert('Reset all data?', 'This clears appliances, rewards, and challenges.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
              ])
            }
            style={({ pressed }) => [styles.resetBtn, pressed ? { opacity: 0.86 } : null]}
          >
            <Ionicons name="refresh-outline" size={18} color="#FF4D6D" />
            <Text style={styles.resetText}>Reset All App Data</Text>
          </Pressable>
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

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  profileIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(77, 163, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { color: '#EAF0FF', fontSize: 18, fontWeight: '900' },
  profileEmail: { color: '#5A7099', fontSize: 13, marginTop: 2, fontWeight: '600' },
  loginBtn: {
    backgroundColor: '#4DA3FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  loginBtnText: { color: '#0B1220', fontWeight: '900', fontSize: 13 },
  logoutBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  logoutText: { color: '#FF4D6D', fontWeight: '700', fontSize: 14 },

  sectionTitle: { color: '#EAF0FF', fontWeight: '900', fontSize: 16 },
  note: { color: '#9DB0D8', fontWeight: '600', fontSize: 14 },
  time: { color: '#5A7099', fontSize: 12 },
  strong: { color: '#EAF0FF', fontWeight: '900', fontSize: 14 },
  smallNote: { color: '#5A7099', fontSize: 11, fontWeight: '600', marginTop: 4 },
  tariffRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  rowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  resetBtn: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.3)',
    backgroundColor: 'rgba(255,77,109,0.05)',
  },
  resetText: { color: '#FF4D6D', fontWeight: '900', fontSize: 15 },
});

