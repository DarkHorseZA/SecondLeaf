import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { Logo } from '@/components/Logo';
import { colors, type, spacing, radii } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { dispatch } = useApp();
  const [pushMessages, setPushMessages] = useState(true);
  const [pushOffers, setPushOffers] = useState(true);
  const [pushMarketing, setPushMarketing] = useState(false);
  const [locationOn, setLocationOn] = useState(true);

  return (
    <Screen scroll>
      <Section title="Account">
        <Row icon="person-outline" label="Edit profile" onPress={() => {}} />
        <Row icon="mail-outline" label="Email & password" onPress={() => {}} />
        <Row icon="card-outline" label="Payout details" onPress={() => {}} />
        <Row icon="shield-checkmark-outline" label="Verify your account" value="Unverified" onPress={() => {}} />
      </Section>

      <Section title="Preferences">
        <Toggle icon="location-outline" label="Use my location" value={locationOn} onChange={setLocationOn} />
        <Toggle icon="chatbubble-ellipses-outline" label="Message notifications" value={pushMessages} onChange={setPushMessages} />
        <Toggle icon="swap-horizontal" label="Offer notifications" value={pushOffers} onChange={setPushOffers} />
        <Toggle icon="megaphone-outline" label="Seasonal tips & newsletter" value={pushMarketing} onChange={setPushMarketing} />
      </Section>

      <Section title="Second Leaf">
        <Row icon="book-outline" label="Community guidelines" onPress={() => {}} />
        <Row icon="leaf-outline" label="About Second Leaf" onPress={() => {}} />
        <Row icon="help-circle-outline" label="Help centre" onPress={() => {}} />
      </Section>

      <Section title="Session">
        <Row
          icon="log-out-outline"
          label="Sign out"
          danger
          onPress={() => {
            dispatch({ type: 'SIGN_OUT' });
            navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
          }}
        />
      </Section>

      <View style={styles.footer}>
        <Logo size={28} />
        <Text style={[type.small, { color: colors.inkMuted, marginTop: spacing.sm }]}>
          secondleaf.co.uk · v1.0.0
        </Text>
        <Text style={[type.small, { color: colors.inkMuted }]}>Give plants a second home.</Text>
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text style={[type.caption, { color: colors.inkMuted, fontWeight: '700', marginBottom: spacing.sm }]}>
        {title.toUpperCase()}
      </Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function Row({
  icon, label, value, danger, onPress,
}: { icon: any; label: string; value?: string; danger?: boolean; onPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.leaf} />
      <Text style={[type.bodyBold, { color: danger ? colors.danger : colors.ink, marginLeft: spacing.md, flex: 1 }]}>
        {label}
      </Text>
      {value ? <Text style={[type.caption, { color: colors.inkMuted, marginRight: 8 }]}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={16} color={colors.inkMuted} />
    </Pressable>
  );
}

function Toggle({
  icon, label, value, onChange,
}: { icon: any; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.leaf} />
      <Text style={[type.bodyBold, { marginLeft: spacing.md, flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.line, true: colors.leafLight }}
        thumbColor={value ? colors.leaf : colors.paper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.paper, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  footer: { alignItems: 'center', marginTop: spacing.xxxl },
});
