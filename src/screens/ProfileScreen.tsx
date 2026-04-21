import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/Avatar';
import { PlantCard } from '@/components/PlantCard';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, type, spacing, radii, shadows } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Tab = 'listings' | 'saved' | 'reviews';

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useApp();
  const [tab, setTab] = React.useState<Tab>('listings');
  const me = state.me;
  const mine = state.listings.filter((l) => l.sellerId === me.id);
  const saved = state.listings.filter((l) => state.saved.has(l.id));

  const header = (
    <View>
      <View style={styles.topRow}>
        <Avatar initials={me.initials} color={me.avatarColor} size={72} />
        <View style={{ marginLeft: spacing.lg, flex: 1 }}>
          <Text style={type.displayMD}>{me.name === 'You' ? 'Your profile' : me.name}</Text>
          <Text style={[type.caption, { color: colors.inkMuted }]}>{me.handle} · {me.town}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color={colors.accent} />
              <Text style={[type.small, { marginLeft: 4 }]}>{me.rating.toFixed(1)} rating</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="leaf" size={12} color={colors.leaf} />
              <Text style={[type.small, { marginLeft: 4 }]}>{me.trades} trades</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={8} style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={20} color={colors.ink} />
        </Pressable>
      </View>
      <Text style={[type.body, { color: colors.inkMuted, marginTop: spacing.md }]}>{me.bio}</Text>

      <View style={styles.stats}>
        <Stat value={mine.length} label="Listings" />
        <Stat value={saved.length} label="Saved" />
        <Stat value={me.trades} label="Trades" />
        <Stat value={`${me.joinedMonths}m`} label="Joined" />
      </View>

      <View style={styles.actionRow}>
        <Button
          label="Share profile"
          icon="share-outline"
          variant="secondary"
          onPress={() => {}}
          style={{ flex: 1, marginRight: spacing.sm }}
        />
        <Button
          label="New listing"
          icon="add"
          onPress={() => navigation.navigate('CreateListing')}
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.tabs}>
        {(['listings', 'saved', 'reviews'] as Tab[]).map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text
              style={[
                type.bodyBold,
                { color: tab === t ? colors.leaf : colors.inkMuted, textTransform: 'capitalize' },
              ]}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const data = tab === 'listings' ? mine : tab === 'saved' ? saved : [];

  return (
    <Screen padded={false}>
      <FlatList
        data={data}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <PlantCard
            listing={item}
            variant="row"
            onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
            saved={state.saved.has(item.id)}
            onToggleSave={() => dispatch({ type: 'TOGGLE_SAVE', id: item.id })}
          />
        )}
        ListEmptyComponent={
          tab === 'reviews' ? (
            <ReviewsPlaceholder />
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={[type.caption, { color: colors.inkMuted }]}>
                {tab === 'saved' ? 'Tap the heart on any plant to save it.' : 'No listings yet — create your first!'}
              </Text>
            </View>
          )
        }
      />
    </Screen>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={type.displayMD}>{value}</Text>
      <Text style={[type.small, { color: colors.inkMuted }]}>{label}</Text>
    </View>
  );
}

function ReviewsPlaceholder() {
  const items = [
    { id: 'r1', name: 'Dev P.', stars: 5, text: 'Super easy swap — plants in perfect nick.' },
    { id: 'r2', name: 'Freya L.', stars: 5, text: 'Lovely chat and a healthy Monstera. Highly recommended.' },
    { id: 'r3', name: 'Kojo M.', stars: 4, text: 'Great communication. Would swap again.' },
  ];
  return (
    <View>
      {items.map((r) => (
        <View key={r.id} style={styles.review}>
          <View style={styles.reviewHeader}>
            <Text style={type.bodyBold}>{r.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < r.stars ? 'star' : 'star-outline'}
                  size={14}
                  color={colors.accent}
                />
              ))}
            </View>
          </View>
          <Text style={[type.body, { color: colors.ink, marginTop: 4 }]}>{r.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.paper,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line,
  },
  badges: { flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm },
  badge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: colors.cream, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line,
  },
  stats: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.paper,
    padding: spacing.lg, borderRadius: radii.lg, marginTop: spacing.lg, ...shadows.soft,
  },
  stat: { alignItems: 'center', flex: 1 },
  actionRow: { flexDirection: 'row', marginTop: spacing.lg },
  tabs: {
    flexDirection: 'row', marginTop: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  tab: { flex: 1, alignItems: 'center', paddingBottom: spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.leaf },
  review: {
    backgroundColor: colors.paper, padding: spacing.lg, borderRadius: radii.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.line,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
