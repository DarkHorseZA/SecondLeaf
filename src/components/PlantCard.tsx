import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Listing } from '@/types';
import { colors, type, spacing, radii, shadows } from '@/theme';
import { PlantArt } from './PlantArt';
import { PriceTag } from './PriceTag';

interface PlantCardProps {
  listing: Listing;
  onPress: () => void;
  onToggleSave?: () => void;
  saved?: boolean;
  variant?: 'list' | 'grid' | 'row';
}

export function PlantCard({ listing, onPress, onToggleSave, saved, variant = 'list' }: PlantCardProps) {
  const [liked, setLiked] = useState(saved ?? false);
  const toggle = () => {
    setLiked((v) => !v);
    onToggleSave?.();
  };

  if (variant === 'row') {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
        <PlantArt seed={listing.imageSeed} size={72} rounded={12} />
        <View style={styles.rowBody}>
          <View style={styles.rowHeader}>
            <Text style={type.bodyBold} numberOfLines={1}>{listing.title}</Text>
            <PriceTag listing={listing} compact />
          </View>
          <Text style={[type.caption, { color: colors.inkMuted }]} numberOfLines={1}>
            {listing.species}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={12} color={colors.inkMuted} />
            <Text style={[type.small, { color: colors.inkMuted, marginLeft: 4 }]}>
              {listing.town} · {listing.distanceMiles.toFixed(1)} mi
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  if (variant === 'grid') {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.grid, pressed && { opacity: 0.85 }]}>
        <View>
          <PlantArt seed={listing.imageSeed} size={160} rounded={14} />
          <Pressable onPress={toggle} style={styles.heartPill} hitSlop={10}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={16} color={liked ? colors.danger : colors.ink} />
          </Pressable>
          <View style={styles.priceFloat}>
            <PriceTag listing={listing} compact />
          </View>
        </View>
        <Text style={[type.bodyBold, { marginTop: 8 }]} numberOfLines={1}>{listing.title}</Text>
        <Text style={[type.small, { color: colors.inkMuted }]} numberOfLines={1}>
          {listing.town} · {listing.distanceMiles.toFixed(1)} mi
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <View style={styles.hero}>
        <PlantArt seed={listing.imageSeed} size={320} rounded={0} />
        <Pressable onPress={toggle} style={styles.heart} hitSlop={10}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? colors.danger : colors.ink} />
        </Pressable>
        <View style={styles.priceBadge}>
          <PriceTag listing={listing} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={type.displayMD} numberOfLines={1}>{listing.title}</Text>
          <View style={styles.likesPill}>
            <Ionicons name="heart" size={12} color={colors.danger} />
            <Text style={[type.small, { color: colors.inkMuted, marginLeft: 4 }]}>{listing.likes}</Text>
          </View>
        </View>
        <Text style={[type.caption, { color: colors.inkMuted }]} numberOfLines={1}>
          {listing.species}
        </Text>
        <View style={styles.metaRow}>
          <MetaIcon icon="location-outline" label={`${listing.town} · ${listing.distanceMiles.toFixed(1)} mi`} />
          <MetaIcon icon="time-outline" label={listing.postedAgo} />
        </View>
      </View>
    </Pressable>
  );
}

function MetaIcon({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={12} color={colors.inkMuted} />
      <Text style={[type.small, { color: colors.inkMuted, marginLeft: 4 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.soft,
  },
  hero: { position: 'relative', width: '100%', alignItems: 'center', backgroundColor: colors.leafMuted },
  heart: {
    position: 'absolute', top: 12, right: 12, backgroundColor: colors.paper,
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    ...shadows.soft,
  },
  priceBadge: { position: 'absolute', bottom: 12, left: 12 },
  body: { padding: spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  likesPill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: colors.cream, borderRadius: radii.pill,
  },
  metaRow: { flexDirection: 'row', marginTop: spacing.sm, gap: spacing.lg },
  meta: { flexDirection: 'row', alignItems: 'center' },

  row: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.sm,
    backgroundColor: colors.paper, borderRadius: radii.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.line,
  },
  rowBody: { flex: 1, marginLeft: spacing.md },
  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },

  grid: {
    width: '48%', marginBottom: spacing.lg,
  },
  heartPill: {
    position: 'absolute', top: 8, right: 8, backgroundColor: colors.paper,
    width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    ...shadows.soft,
  },
  priceFloat: { position: 'absolute', bottom: 8, left: 8 },
});
