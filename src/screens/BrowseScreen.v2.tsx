import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList, Image,
  RefreshControl, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { LogoMarkV2 } from '@/components/Logo.v2';
import { PlantArt } from '@/components/PlantArt';
import { spacing, radii, shadows, type } from '@/theme';
import { colors as v2 } from '@/theme/colors.v2';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';
import { Listing } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface CategoryDefV2 {
  id: 'all' | 'rare' | 'succulent' | 'fern' | 'cactus' | 'herb' | 'veg' | 'seeds';
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const categories: CategoryDefV2[] = [
  { id: 'all',      label: 'All',       icon: (a) => <MaterialCommunityIcons name="flower-outline" size={26} color={a ? v2.bark : v2.ink} /> },
  { id: 'rare',     label: 'Rare',      icon: (a) => <MaterialCommunityIcons name="mushroom-outline" size={26} color={a ? v2.bark : v2.ink} /> },
  { id: 'succulent',label: 'Succulent', icon: (a) => <MaterialCommunityIcons name="cactus" size={26} color={a ? v2.bark : v2.ink} /> },
  { id: 'fern',     label: 'Fern',      icon: (a) => <MaterialCommunityIcons name="leaf-maple" size={26} color={a ? v2.bark : v2.ink} /> },
  { id: 'cactus',   label: 'Cactus',    icon: (a) => <MaterialCommunityIcons name="cactus" size={26} color={a ? v2.bark : v2.ink} /> },
  { id: 'herb',     label: 'Herb',      icon: (a) => <MaterialCommunityIcons name="leaf" size={26} color={a ? v2.bark : v2.ink} /> },
  { id: 'veg',      label: 'Veg',       icon: (a) => <MaterialCommunityIcons name="carrot" size={26} color={a ? v2.bark : v2.ink} /> },
  { id: 'seeds',    label: 'Seeds',     icon: (a) => <MaterialCommunityIcons name="seed-outline" size={26} color={a ? v2.bark : v2.ink} /> },
];

function modeLabel(l: Listing): { text: string; price?: string; tone: 'swap' | 'sell' | 'free' | 'sitter' } {
  if (l.mode === 'trade') return { text: 'Swap', tone: 'swap' };
  if (l.mode === 'giveaway') return { text: 'Free', tone: 'free' };
  return { text: '', price: `£${l.price?.toFixed(0) ?? '0'}`, tone: 'sell' };
}

export function BrowseScreenV2() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryDefV2['id']>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.listings.filter((l) => {
      if (category === 'rare' && l.care !== 'expert') return false;
      if (category !== 'all' && category !== 'rare' && l.category !== category) return false;
      if (q && !`${l.title} ${l.species} ${l.town}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.listings, query, category]);

  const openListing = (id: string) => navigation.navigate('ListingDetail', { listingId: id });

  const header = (
    <View>
      {/* Announcement banner */}
      <View style={styles.banner}>
        <Ionicons name="megaphone-outline" size={18} color={v2.paper} />
        <Text style={[type.caption, { color: v2.paper, marginLeft: spacing.sm, flex: 1 }]}>
          Welcome, we're a new startup and actively building. Your feedback helps us make the platform better every day.
        </Text>
      </View>

      {/* Top bar: mark / search pill / menu + profile */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.navigate('Tabs', { screen: 'Browse' })} hitSlop={8}>
          <LogoMarkV2 size={38} />
        </Pressable>

        <View style={styles.searchPill}>
          <TextInput
            placeholder="Search for plants"
            placeholderTextColor={v2.inkMuted}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          <Pressable style={styles.searchBtn} hitSlop={6}>
            <Ionicons name="search" size={16} color={v2.paper} />
          </Pressable>
        </View>

        <View style={styles.topActions}>
          <Pressable style={styles.iconBtn} onPress={() => setMenuOpen((v) => !v)} hitSlop={8}>
            <Feather name="menu" size={18} color={v2.ink} />
          </Pressable>
          <Pressable
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Tabs', { screen: 'Profile' })}
            hitSlop={8}
          >
            <Ionicons name="person" size={18} color={v2.inkMuted} />
          </Pressable>
        </View>
      </View>

      {menuOpen ? (
        <View style={styles.menu}>
          {['Home', 'Browse', 'Sell', 'Swap', 'Messages', 'About', 'Sign in'].map((item) => (
            <Pressable
              key={item}
              style={styles.menuRow}
              onPress={() => {
                setMenuOpen(false);
                if (item === 'Sell' || item === 'Swap') navigation.navigate('CreateListing');
                if (item === 'Messages') navigation.navigate('Tabs', { screen: 'Messages' });
                if (item === 'Sign in') navigation.navigate('SignIn');
              }}
            >
              <Text style={[type.body, { color: v2.bark, fontWeight: '600' }]}>{item}</Text>
              <Ionicons name="chevron-forward" size={14} color={v2.inkMuted} />
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Category strip */}
      <View style={styles.catStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catStrip}
        >
          {categories.map((c) => {
            const active = category === c.id;
            return (
              <Pressable key={c.id} onPress={() => setCategory(c.id)} style={styles.catItem}>
                <View style={styles.catIcon}>{c.icon(active)}</View>
                <Text
                  style={[
                    type.caption,
                    { color: active ? v2.bark : v2.ink, fontWeight: active ? '700' : '500' },
                  ]}
                >
                  {c.label}
                </Text>
                <View style={[styles.catUnderline, active && styles.catUnderlineActive]} />
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable style={styles.filtersBtn} onPress={() => navigation.navigate('Tabs', { screen: 'Search' })}>
          <Feather name="sliders" size={15} color={v2.bark} />
          <Text style={[type.caption, { color: v2.bark, marginLeft: 6, fontWeight: '700' }]}>Filters</Text>
        </Pressable>
      </View>

      <View style={{ height: spacing.md }} />
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <View style={styles.footerRow}>
        <Text style={[type.caption, { color: v2.inkMuted }]}>© 2026 SecondLeaf Ltd</Text>
        <Text style={[type.caption, { color: v2.inkMuted }]}>•</Text>
        <Pressable><Text style={[type.caption, { color: v2.bark, fontWeight: '700' }]}>About</Text></Pressable>
        <Text style={[type.caption, { color: v2.inkMuted }]}>•</Text>
        <Pressable><Text style={[type.caption, { color: v2.bark, fontWeight: '700' }]}>Privacy</Text></Pressable>
        <Text style={[type.caption, { color: v2.inkMuted }]}>•</Text>
        <Pressable><Text style={[type.caption, { color: v2.bark, fontWeight: '700' }]}>Terms</Text></Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: v2.paper }}>
      <FlatList
        data={filtered}
        keyExtractor={(l) => l.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 140 }}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 500); }}
            tintColor={v2.leaf}
          />
        }
        renderItem={({ item }) => (
          <ListingCardV2
            listing={item}
            onPress={() => openListing(item.id)}
            saved={state.saved.has(item.id)}
            onToggleSave={() => dispatch({ type: 'TOGGLE_SAVE', id: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: spacing.xxxl }}>
            <Text style={[type.body, { color: v2.inkMuted }]}>No plants match that search.</Text>
          </View>
        }
      />

      {/* Floating location pill */}
      <Pressable
        style={[styles.locPill, shadows.lift]}
        onPress={() => navigation.navigate('Tabs', { screen: 'Search' })}
      >
        <Text style={[type.bodyBold, { color: v2.paper }]}>View listings by location</Text>
        <Feather name="map" size={16} color={v2.paper} style={{ marginLeft: spacing.sm }} />
      </Pressable>
    </SafeAreaView>
  );
}

interface CardProps {
  listing: Listing;
  onPress: () => void;
  saved: boolean;
  onToggleSave: () => void;
}

function ListingCardV2({ listing, onPress, saved, onToggleSave }: CardProps) {
  const label = modeLabel(listing);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <View style={styles.cardMedia}>
        <PlantArt seed={listing.imageSeed} size={300} rounded={14} />
        <Pressable style={styles.heartPill} onPress={onToggleSave} hitSlop={10}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={16} color={saved ? v2.danger : v2.ink} />
        </Pressable>
      </View>
      <Text style={[styles.cardTitle, type.bodyBold]} numberOfLines={1}>
        Example Listing{listing.id.slice(-1)}
      </Text>
      <Text style={[type.body, { color: v2.ink }]} numberOfLines={1}>{listing.town}</Text>
      {label.tone === 'swap' ? (
        <Text style={[type.bodyBold, { color: v2.bark }]}>Swap</Text>
      ) : label.tone === 'free' ? (
        <Text style={[type.bodyBold, { color: v2.bark }]}>Free</Text>
      ) : (
        <Text style={[type.body]}>
          <Text style={[type.bodyBold, { color: v2.bark }]}>{label.price} </Text>
          <Text style={{ color: v2.ink }}>Plantsitting Host</Text>
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: v2.leaf, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    marginHorizontal: -spacing.lg, marginTop: -1,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, gap: spacing.sm,
  },
  searchPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: v2.paper, borderRadius: 999,
    borderWidth: 1, borderColor: v2.line,
    paddingLeft: spacing.lg, paddingRight: 4,
    height: 46,
    ...Platform.select({
      web: { boxShadow: '0 3px 10px rgba(11,84,84,0.08)' },
      default: {
        shadowColor: v2.bark, shadowOpacity: 0.08,
        shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
      },
    }),
  },
  searchInput: { flex: 1, fontSize: 15, color: v2.ink, padding: 0 },
  searchBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: v2.leaf,
    alignItems: 'center', justifyContent: 'center',
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: v2.line,
    alignItems: 'center', justifyContent: 'center',
  },
  menu: {
    backgroundColor: v2.paper, borderRadius: radii.md,
    borderWidth: 1, borderColor: v2.line,
    paddingVertical: spacing.xs, marginTop: -spacing.xs, marginBottom: spacing.md,
  },
  menuRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: v2.line,
  },
  catStripWrap: {
    flexDirection: 'row', alignItems: 'stretch',
    paddingVertical: spacing.md,
  },
  catStrip: { gap: spacing.xl, paddingRight: spacing.lg },
  catItem: { alignItems: 'center', width: 64, paddingTop: 4 },
  catIcon: { height: 34, alignItems: 'center', justifyContent: 'center' },
  catUnderline: {
    height: 2, width: 26, marginTop: 6, backgroundColor: 'transparent',
  },
  catUnderlineActive: { backgroundColor: v2.bark },
  filtersBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radii.md, borderWidth: 1, borderColor: v2.line,
    alignSelf: 'center', backgroundColor: v2.paper,
  },
  gridRow: { justifyContent: 'space-between', marginBottom: spacing.xl },
  card: { width: '48%' },
  cardMedia: {
    width: '100%', aspectRatio: 1, borderRadius: 14, overflow: 'hidden',
    backgroundColor: v2.leafMuted, marginBottom: spacing.sm,
  },
  cardTitle: { color: v2.bark, marginTop: spacing.xs },
  heartPill: {
    position: 'absolute', top: 8, right: 8, backgroundColor: v2.paper,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000', shadowOpacity: 0.08,
        shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2,
      },
    }),
  },
  locPill: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: v2.bark, paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: 999,
  },
  footer: {
    alignItems: 'center', paddingTop: spacing.xxxl, paddingBottom: spacing.xxl,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
});
