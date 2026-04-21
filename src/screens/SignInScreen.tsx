import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { colors, type, spacing, radii } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SignInScreen() {
  const navigation = useNavigation<Nav>();
  const { dispatch } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    dispatch({ type: 'SIGN_IN' });
    navigation.replace('Tabs', { screen: 'Browse' });
  };

  return (
    <LinearGradient colors={[colors.leafDark, colors.leaf]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, padding: spacing.xl, justifyContent: 'space-between' }}
        >
          <View>
            <Logo size={40} tone="light" showTagline />
            <Text style={[type.displayXL, { color: colors.paper, marginTop: spacing.xxxl }]}>
              Welcome{'\n'}back to the garden.
            </Text>
            <Text style={[type.body, { color: colors.leafMuted, marginTop: spacing.sm, opacity: 0.9 }]}>
              Buy, sell or swap plants with growers near you.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.modeRow}>
              <Pressable
                style={[styles.modeTab, mode === 'signin' && styles.modeTabActive]}
                onPress={() => setMode('signin')}
              >
                <Text style={[type.bodyBold, { color: mode === 'signin' ? colors.leaf : colors.inkMuted }]}>
                  Sign in
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[type.bodyBold, { color: mode === 'signup' ? colors.leaf : colors.inkMuted }]}>
                  Sign up
                </Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={colors.inkMuted}
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.inkMuted}
              style={styles.input}
            />

            <Button
              label={mode === 'signin' ? 'Sign in' : 'Create account'}
              onPress={onSubmit}
              full
              style={{ marginTop: spacing.xl }}
            />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={[type.small, { color: colors.inkMuted, marginHorizontal: spacing.sm }]}>or</Text>
              <View style={styles.line} />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable style={styles.social}>
                <Ionicons name="logo-google" size={18} color={colors.ink} />
                <Text style={[type.caption, { marginLeft: 6, fontWeight: '700' }]}>Google</Text>
              </Pressable>
              <Pressable style={styles.social}>
                <Ionicons name="logo-apple" size={18} color={colors.ink} />
                <Text style={[type.caption, { marginLeft: 6, fontWeight: '700' }]}>Apple</Text>
              </Pressable>
            </View>

            <Pressable onPress={onSubmit} style={{ alignItems: 'center', marginTop: spacing.md }}>
              <Text style={[type.caption, { color: colors.inkMuted }]}>Continue as guest</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper, borderRadius: radii.xl, padding: spacing.xl,
  },
  modeRow: { flexDirection: 'row', marginBottom: spacing.lg, backgroundColor: colors.cream, borderRadius: radii.pill, padding: 4 },
  modeTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radii.pill },
  modeTabActive: { backgroundColor: colors.paper },
  label: { ...type.small, fontWeight: '700', color: colors.inkMuted, marginTop: spacing.sm, marginBottom: 6 },
  input: {
    backgroundColor: colors.cream, borderRadius: radii.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderWidth: 1, borderColor: colors.line, fontSize: 15, color: colors.ink,
  },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.line },
  social: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line,
  },
});
