import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { PlantArt } from '@/components/PlantArt';
import { colors, type, spacing, radii } from '@/theme';
import { categories } from '@/data/categories';
import { ListingMode, PlantCategory, CareLevel, LightLevel, Listing } from '@/types';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CreateListingScreen() {
  const navigation = useNavigation<Nav>();
  const { dispatch, state } = useApp();

  const [mode, setMode] = useState<ListingMode>('sell');
  const [title, setTitle] = useState('');
  const [species, setSpecies] = useState('');
  const [price, setPrice] = useState('');
  const [tradeFor, setTradeFor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PlantCategory>('houseplant');
  const [care, setCare] = useState<CareLevel>('easy');
  const [light, setLight] = useState<LightLevel>('medium');
  const [height, setHeight] = useState('');
  const [potIncluded, setPotIncluded] = useState(true);
  const [petFriendly, setPetFriendly] = useState(true);
  const [town, setTown] = useState(state.me.town);

  const seed = useMemo(() => (title || species || 'newleaf').toLowerCase().replace(/\s+/g, '-'), [title, species]);

  const canSubmit =
    title.trim().length > 2 &&
    species.trim().length > 1 &&
    (mode !== 'sell' || parseFloat(price) > 0) &&
    description.trim().length > 10;

  const submit = () => {
    const listing: Listing = {
      id: `me-${Date.now()}`,
      title: title.trim(),
      species: species.trim(),
      description: description.trim(),
      mode,
      price: mode === 'sell' ? parseFloat(price) : null,
      tradeFor: mode === 'trade' ? tradeFor.trim() : undefined,
      category,
      care,
      light,
      petFriendly,
      height: height.trim() || '—',
      potIncluded,
      town: town.trim() || state.me.town,
      distanceMiles: 0.1,
      postedAgo: 'Just now',
      sellerId: state.me.id,
      imageSeed: seed,
      likes: 0,
    };
    dispatch({ type: 'ADD_LISTING', listing });
    Alert.alert('Listing posted', `${listing.title} is live on Second Leaf.`, [
      { text: 'View', onPress: () => navigation.replace('ListingDetail', { listingId: listing.id }) },
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.cream }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.photoCard}>
            <PlantArt seed={seed} size={160} rounded={18} />
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <Text style={type.bodyBold}>Cover illustration</Text>
              <Text style={[type.caption, { color: colors.inkMuted, marginTop: 2 }]}>
                A preview based on your plant. Tap below to add photos.
              </Text>
              <Pressable style={styles.photoBtn}>
                <Ionicons name="camera-outline" size={16} color={colors.leaf} />
                <Text style={[type.caption, { color: colors.leaf, fontWeight: '700', marginLeft: 6 }]}>
                  Add photos
                </Text>
              </Pressable>
            </View>
          </View>

          <Label>Listing type</Label>
          <View style={{ flexDirection: 'row' }}>
            {(['sell', 'trade', 'giveaway'] as ListingMode[]).map((m) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[styles.modePill, mode === m && styles.modePillActive]}
              >
                <Ionicons
                  name={m === 'sell' ? 'pricetag-outline' : m === 'trade' ? 'swap-horizontal' : 'gift-outline'}
                  size={16}
                  color={mode === m ? colors.paper : colors.ink}
                />
                <Text
                  style={[
                    type.bodyBold,
                    { color: mode === m ? colors.paper : colors.ink, marginLeft: 6, textTransform: 'capitalize' },
                  ]}
                >
                  {m === 'giveaway' ? 'Give away' : m}
                </Text>
              </Pressable>
            ))}
          </View>

          <Label>Title</Label>
          <Field value={title} onChangeText={setTitle} placeholder="e.g. Monstera Deliciosa" />

          <Label>Species / Latin name</Label>
          <Field value={species} onChangeText={setSpecies} placeholder="e.g. Monstera deliciosa" />

          {mode === 'sell' ? (
            <>
              <Label>Price (£)</Label>
              <Field value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" />
            </>
          ) : null}

          {mode === 'trade' ? (
            <>
              <Label>What would you swap for?</Label>
              <Field value={tradeFor} onChangeText={setTradeFor} placeholder="e.g. Hoya cutting" />
            </>
          ) : null}

          <Label>Description</Label>
          <Field
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about the plant, its age, quirks, and pickup options."
            multiline
            style={{ minHeight: 100 }}
          />

          <Label>Category</Label>
          <View style={styles.wrap}>
            {categories.filter((c) => c.id !== 'all').map((c) => (
              <Chip
                key={c.id}
                label={c.label}
                icon={c.icon}
                selected={category === c.id}
                onPress={() => setCategory(c.id as PlantCategory)}
              />
            ))}
          </View>

          <Label>Care level</Label>
          <View style={styles.wrap}>
            {(['easy', 'moderate', 'expert'] as CareLevel[]).map((c) => (
              <Chip key={c} label={cap(c)} selected={care === c} onPress={() => setCare(c)} />
            ))}
          </View>

          <Label>Light</Label>
          <View style={styles.wrap}>
            {(['low', 'medium', 'bright', 'direct'] as LightLevel[]).map((l) => (
              <Chip key={l} label={cap(l)} selected={light === l} onPress={() => setLight(l)} />
            ))}
          </View>

          <Label>Height</Label>
          <Field value={height} onChangeText={setHeight} placeholder="e.g. 40 cm" />

          <Label>Town</Label>
          <Field value={town} onChangeText={setTown} placeholder="e.g. Brighton" />

          <Toggle label="Pot included" value={potIncluded} onChange={setPotIncluded} />
          <Toggle label="Pet friendly" value={petFriendly} onChange={setPetFriendly} />

          <Button
            label="Post listing"
            onPress={submit}
            disabled={!canSubmit}
            style={{ marginTop: spacing.xxl }}
            full
          />
          <Button
            label="Cancel"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.sm }}
            full
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

function Field(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.inkMuted}
      style={[styles.field, props.style]}
    />
  );
}

function Toggle({
  label, value, onChange,
}: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable style={styles.toggleRow} onPress={() => onChange(!value)}>
      <Text style={type.bodyBold}>{label}</Text>
      <View style={[styles.toggle, value && { backgroundColor: colors.leaf }]}>
        <View style={[styles.knob, value && { transform: [{ translateX: 18 }] }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  photoCard: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    backgroundColor: colors.paper, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.line,
  },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    marginTop: spacing.md, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: radii.pill, borderWidth: 1, borderColor: colors.leaf, backgroundColor: colors.leafMuted,
  },
  label: { ...type.caption, fontWeight: '700', color: colors.inkMuted, marginTop: spacing.lg, marginBottom: spacing.sm },
  field: {
    backgroundColor: colors.paper, borderRadius: radii.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderWidth: 1, borderColor: colors.line, fontSize: 15, color: colors.ink,
  },
  modePill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 10,
    borderRadius: radii.pill, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line,
    marginRight: spacing.sm,
  },
  modePillActive: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.paper, padding: spacing.md, borderRadius: radii.md,
    marginTop: spacing.sm, borderWidth: 1, borderColor: colors.line,
  },
  toggle: { width: 42, height: 24, borderRadius: 12, backgroundColor: colors.line, padding: 2 },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.paper },
});
