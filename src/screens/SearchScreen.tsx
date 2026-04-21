import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { PlantCard } from '@/components/PlantCard';
import { Chip } from '@/components/Chip';
import { colors, type, spacing, radii } from '@/theme';
import { categories, modes, sorts, SortId, CategoryDef } from '@/data/categories';
import { useApp } from '@/context/AppContext';
import { Listing } from '@/types';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const suggestions = ['Monstera', 'Pilea', 'Herbs', 'Succulents', 'Free plants', 'Swaps near me'];

export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryDef['id']>('all');
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('all');
  const [sort, setSort] = useState<SortId>('newest');
  const [maxMiles, setMaxMiles] = useState(50);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = state.listings.filter((l) => {
      if (category !== 'all' && l.category !== category) return false;
      if (mode !== 'all' && l.mode !== mode) return false;
      if (l.distanceMiles > maxMiles) return false;
      if (
        q &&
        !`${l.title} ${l.species} ${l.town} ${l.description}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
    switch (sort) {
      case 'nearby':
        out = [...out].sort((a, b) => a.distanceMiles - b.distanceMiles);
        break;
      case 'price_low':
        out = [...out].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price_high':
        out = [...out].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'popular':
        out = [...out].sort((a, b) => b.likes - a.likes);
        break;
    }
    return out;
  }, [state.listings, query, category, mode, sort, maxMiles]);

  const header = (
    <View>
      <Text style={type.displayLG}>Find a new leaf</Text>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.inkMuted} />
        <TextInput
          style={styles.input}
          placeholder="Search plants, species, towns…"
          placeholderTextColor={colors.inkMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.inkMuted} />
          </Pressable>
        ) : null}
      </View>

      {!query ? (
        <View style={styles.suggestions}>
          <Text style={[type.caption, { color: colors.inkMuted, marginBottom: spacing.sm }]}>
            Popular right now
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {suggestions.map((s) => (
              <Chip key={s} label={s} onPress={() => setQuery(s)} />
            ))}
          </View>
        </View>
      ) : null}

      <Text style={styles.filterLabel}>Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

      <Text style={styles.filterLabel}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            icon={c.icon}
            selected={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </ScrollView>

      <Text style={styles.filterLabel}>Sort by</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sorts.map((s) => (
          <Chip key={s.id} label={s.label} selected={sort === s.id} onPress={() => setSort(s.id)} />
        ))}
      </ScrollView>

      <Text style={styles.filterLabel}>Within {maxMiles} miles</Text>
      <View style={styles.distanceRow}>
        {[5, 10, 25, 50, 100].map((m) => (
          <Pressable
            key={m}
            onPress={() => setMaxMiles(m)}
            style={[styles.distBtn, maxMiles === m && styles.distBtnActive]}
          >
            <Text
              style={[
                type.caption,
                { color: maxMiles === m ? colors.paper : colors.ink, fontWeight: '600' },
              ]}
            >
              {m} mi
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.resultRow}>
        <Text style={[type.bodyBold]}>{filtered.length} results</Text>
        <Pressable
          onPress={() => {
            setQuery('');
            setCategory('all');
            setMode('all');
            setSort('newest');
            setMaxMiles(50);
          }}
        >
          <Text style={[type.caption, { color: colors.leaf, fontWeight: '700' }]}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Screen padded={false}>
      <FlatList
        data={filtered}
        keyExtractor={(l) => l.id}
        contentContainerStyle={styles.listContent}
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
          <View style={{ paddingTop: spacing.xxxl, alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={40} color={colors.leafLight} />
            <Text style={[type.bodyBold, { marginTop: spacing.md }]}>No plants match that.</Text>
            <Text style={[type.caption, { color: colors.inkMuted, marginTop: 4 }]}>
              Try widening the distance or clearing filters.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, paddingBottom: spacing.xxxl },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.paper, borderRadius: radii.pill,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginTop: spacing.md,
    borderWidth: 1, borderColor: colors.line,
  },
  input: { flex: 1, fontSize: 15, color: colors.ink, padding: 0 },
  suggestions: { marginTop: spacing.lg },
  filterLabel: { ...type.caption, color: colors.inkMuted, marginTop: spacing.lg, marginBottom: spacing.sm, fontWeight: '700' },
  distanceRow: { flexDirection: 'row', flexWrap: 'wrap' },
  distBtn: {
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line,
    marginRight: spacing.sm, marginBottom: spacing.sm, backgroundColor: colors.paper,
  },
  distBtnActive: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm },
});
