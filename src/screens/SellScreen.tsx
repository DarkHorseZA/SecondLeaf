import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { PlantCard } from '@/components/PlantCard';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, type, spacing, radii, shadows } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const options = [
  { id: 'sell', title: 'Sell', body: 'Set a price, meet a fellow grower.', icon: 'pricetag-outline' },
  { id: 'trade', title: 'Swap', body: 'Trade cuttings, seeds, or whole plants.', icon: 'swap-horizontal' },
  { id: 'giveaway', title: 'Give away', body: 'Send surplus seedlings to a loving home.', icon: 'gift-outline' },
] as const;

export function SellScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useApp();
  const mine = state.listings.filter((l) => l.sellerId === state.me.id);

  return (
    <Screen scroll>
      <Text style={type.displayLG}>Give a plant a second leaf.</Text>
      <Text style={[type.body, { color: colors.inkMuted, marginTop: 4 }]}>
        What would you like to do today?
      </Text>

      <View style={styles.optionGrid}>
        {options.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => navigation.navigate('CreateListing')}
            style={[styles.option, shadows.soft]}
          >
            <View style={styles.optionIcon}>
              <Ionicons name={o.icon as any} size={22} color={colors.leaf} />
            </View>
            <Text style={[type.bodyBold, { marginTop: spacing.md }]}>{o.title}</Text>
            <Text style={[type.small, { color: colors.inkMuted, marginTop: 2 }]}>{o.body}</Text>
          </Pressable>
        ))}
      </View>

      <Button
        label="Create a new listing"
        icon="add"
        onPress={() => navigation.navigate('CreateListing')}
        style={{ marginTop: spacing.lg }}
        full
      />

      <SectionHeader title="Your listings" subtitle={`${mine.length} live`} />
      {mine.length ? (
        mine.map((l) => (
          <PlantCard
            key={l.id}
            listing={l}
            variant="row"
            onPress={() => navigation.navigate('ListingDetail', { listingId: l.id })}
          />
        ))
      ) : (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={32} color={colors.leaf} />
          <Text style={[type.bodyBold, { marginTop: spacing.sm }]}>No listings yet</Text>
          <Text style={[type.caption, { color: colors.inkMuted, marginTop: 4, textAlign: 'center' }]}>
            Your first listing takes about a minute. Snap a photo, set a price or swap, and you're away.
          </Text>
        </View>
      )}

      <SectionHeader title="Seller tips" actionLabel="More" onAction={() => {}} />
      <View style={styles.tip}>
        <Ionicons name="camera-outline" size={20} color={colors.leaf} />
        <View style={{ marginLeft: spacing.md, flex: 1 }}>
          <Text style={type.bodyBold}>Natural light photos sell faster</Text>
          <Text style={[type.caption, { color: colors.inkMuted, marginTop: 2 }]}>
            Listings with daylight photos find a home 40% quicker.
          </Text>
        </View>
      </View>
      <View style={styles.tip}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.leaf} />
        <View style={{ marginLeft: spacing.md, flex: 1 }}>
          <Text style={type.bodyBold}>Meet safely, swap kindly</Text>
          <Text style={[type.caption, { color: colors.inkMuted, marginTop: 2 }]}>
            Use the in-app chat and choose public meetup spots.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  optionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl, gap: spacing.sm },
  option: {
    flex: 1, backgroundColor: colors.paper, borderRadius: radii.lg, padding: spacing.lg,
  },
  optionIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.leafMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  empty: {
    alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg,
    backgroundColor: colors.paper, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.line,
  },
  tip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper,
    borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.line,
  },
});
