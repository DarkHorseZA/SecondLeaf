import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radii } from '@/theme';
import { Listing } from '@/types';

export function formatPrice(listing: Pick<Listing, 'mode' | 'price' | 'tradeFor'>) {
  if (listing.mode === 'giveaway') return 'Free';
  if (listing.mode === 'trade') return 'Swap';
  return listing.price ? `£${listing.price.toFixed(2)}` : 'Free';
}

interface PriceTagProps {
  listing: Pick<Listing, 'mode' | 'price' | 'tradeFor'>;
  compact?: boolean;
}

export function PriceTag({ listing, compact }: PriceTagProps) {
  const { bg, fg, icon } = getStyles(listing.mode);
  return (
    <View style={[styles.tag, { backgroundColor: bg }, compact && styles.compact]}>
      <Ionicons name={icon} size={compact ? 11 : 13} color={fg} style={{ marginRight: 4 }} />
      <Text style={[compact ? type.small : type.caption, { color: fg, fontWeight: '700' }]}>
        {formatPrice(listing)}
      </Text>
    </View>
  );
}

function getStyles(mode: Listing['mode']) {
  switch (mode) {
    case 'trade':
      return { bg: '#E4EFFA', fg: '#2D5D8A', icon: 'swap-horizontal' as const };
    case 'giveaway':
      return { bg: '#E6F3EA', fg: colors.leafDark, icon: 'gift-outline' as const };
    default:
      return { bg: '#FFF4DA', fg: '#8F6A1E', icon: 'pricetag-outline' as const };
  }
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  compact: { paddingHorizontal: 6, paddingVertical: 3 },
});
