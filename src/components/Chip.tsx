import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radii } from '@/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: 'default' | 'sell' | 'trade' | 'giveaway';
}

const toneColors = {
  default: { bg: colors.paper, text: colors.ink, border: colors.line, iconBg: colors.leafMuted },
  sell: { bg: '#FFF4DA', text: '#8F6A1E', border: '#F2D9A1', iconBg: '#F2D9A1' },
  trade: { bg: '#E4EFFA', text: '#2D5D8A', border: '#BED5EC', iconBg: '#BED5EC' },
  giveaway: { bg: '#E6F3EA', text: colors.leafDark, border: colors.leafMuted, iconBg: colors.leafMuted },
};

export function Chip({ label, selected, onPress, icon, tone = 'default' }: ChipProps) {
  const palette = toneColors[tone];
  const bg = selected ? colors.leaf : palette.bg;
  const fg = selected ? colors.paper : palette.text;
  const border = selected ? colors.leaf : palette.border;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, borderColor: border },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.row}>
        {icon ? <Ionicons name={icon} size={13} color={fg} style={{ marginRight: 6 }} /> : null}
        <Text style={[type.caption, { color: fg }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
