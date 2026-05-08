import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';

export function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const login = useAppStore((s) => s.login);
  const navigation = useNavigation();

  const handleAuth = () => {
    if (!email || !password || (isRegister && !name)) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate auth
    login(email, name || email.split('@')[0]);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color="#EAF0FF" />
          </Pressable>
          <Text style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={styles.subtitle}>
            {isRegister 
              ? 'Join PowerPulse to start managing your energy.' 
              : 'Sign in to access your appliances and rewards.'}
          </Text>
        </View>

        <Card style={styles.formCard}>
          {isRegister && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor="#5A7099"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor="#5A7099"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#5A7099"
              secureTextEntry
            />
          </View>

          <Pressable
            onPress={handleAuth}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.primaryBtnText}>
              {isRegister ? 'Register' : 'Login'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setIsRegister(!isRegister)}
            style={styles.switchBtn}
          >
            <Text style={styles.switchText}>
              {isRegister 
                ? 'Already have an account? Login' 
                : "Don't have an account? Register"}
            </Text>
          </Pressable>
        </Card>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    marginBottom: 32,
  },
  backBtn: {
    marginBottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16233A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#EAF0FF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#5A7099',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
    lineHeight: 22,
  },
  formCard: {
    padding: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#5A7099',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#22304A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#EAF0FF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#4DA3FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#0B1220',
    fontSize: 18,
    fontWeight: '900',
  },
  switchBtn: {
    alignItems: 'center',
    marginTop: 4,
  },
  switchText: {
    color: '#4DA3FF',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#5A7099',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
