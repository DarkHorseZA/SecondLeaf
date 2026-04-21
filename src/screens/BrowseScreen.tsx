import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Logo } from '@/components/Logo';
import { PlantCard } from '@/components/PlantCard';
import { Chip } from '@/components/Chip';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, type, spacing, radii, shadows } from '@/theme';
import { categories, modes, CategoryDef } from '@/data/categories';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';
import { Listing } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function BrowseScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useApp();
  const [category, setCategory] = useState<CategoryDef['id']>('all');
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('all');
  const [refreshing, setRefreshing] = useState(false);
  const unreadNotifs = state.notifications.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    return state.listings.filter((l) => {
      if (category !== 'all' && l.category !== category) return false;
      if (mode !== 'all' && l.mode !== mode) return false;
      return true;
    });
  }, [state.listings, category, mode]);

  const featured = state.listings.slice(0, 4);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const openListing = (id: string) => navigation.navigate('ListingDetail', { listingId: id });

  const header = (
    <View>
      <View style={styles.topBar}>
        <Logo size={34} />
        <View style={styles.topActions}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => dispatch({ type: 'SET_VIEW', mode: state.viewMode === 'list' ? 'grid' : 'list' })}
            hitSlop={8}
          >
            <Ionicons
              name={state.viewMode === 'list' ? 'grid-outline' : 'list-outline'}
              size={20}
              color={colors.ink}
            />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Notifications')}
            hitSlop={8}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.ink} />
            {unreadNotifs ? <View style={styles.dot} /> : null}
          </Pressable>
        </View>
      </View>

      <View style={styles.hello}>
        <Text style={type.displayXL}>Morning, {state.me.name === 'You' ? 'grower' : state.me.name}.</Text>
        <Text style={[type.body, { color: colors.inkMuted, marginTop: 4 }]}>
          Plants looking for a second home near {state.me.town}.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: spacing.xs }}
      >
        {modes.map((m) => (
          <Chip
            key={m.id}
            label={m.label}
            icon={m.icon as any}
            selected={mode === m.id}
            onPress={() => setMode(m.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: spacing.xs }}
      >
        {categories.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCategory(c.id)}
            style={[styles.catPill, category === c.id && styles.catPillActive]}
          >
            <View style={[styles.catIcon, category === c.id && styles.catIconActive]}>
              <Ionicons
                name={c.icon}
                size={18}
                color={category === c.id ? colors.paper : colors.leaf}
              />
            </View>
            <Text
              style={[type.small, { color: category === c.id ? colors.leaf : colors.ink, marginTop: 6 }]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader
        title="Featured near you"
        subtitle={`${filtered.length} listings`}
        actionLabel="See all"
        onAction={() => navigation.navigate('Tabs', { screen: 'Search' })}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featured.map((l) => (
          <Pressable
            key={l.id}
            onPress={() => openListing(l.id)}
            style={[styles.featured, shadows.soft]}
          >
            <PlantCard listing={l} onPress={() => openListing(l.id)} variant="grid" />
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader title="All listings" subtitle={`${filtered.length} plants · viewing as ${state.viewMode}`} />
    </View>
  );

  const keyExtractor = (l: Listing) => l.id;
  const renderItem = ({ item }: { item: Listing }) => (
    <PlantCard
      listing={item}
      onPress={() => openListing(item.id)}
      variant={state.viewMode === 'grid' ? 'grid' : 'list'}
      saved={state.saved.has(item.id)}
      onToggleSave={() => dispatch({ type: 'TOGGLE_SAVE', id: item.id })}
    />
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        numColumns={state.viewMode === 'grid' ? 2 : 1}
        key={state.viewMode}
        columnWrapperStyle={state.viewMode === 'grid' ? styles.gridWrap : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.leaf} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  topActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.paper,
    alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm,
    borderWidth: 1, borderColor: colors.line,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger,
    position: 'absolute', top: 9, right: 9,
  },
  hello: { marginTop: spacing.xl, marginBottom: spacing.lg },
  catPill: {
    alignItems: 'center',
    width: 78,
    marginRight: spacing.sm,
  },
  catPillActive: {},
  catIcon: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: colors.paper,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.line,
  },
  catIconActive: {
    backgroundColor: colors.leaf, borderColor: colors.leaf,
  },
  featured: {
    width: 200, marginRight: spacing.md, padding: spacing.sm,
    backgroundColor: colors.paper, borderRadius: radii.lg,
  },
  gridWrap: { justifyContent: 'space-between' },
});
