import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radii } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  full?: boolean;
  size?: 'md' | 'lg';
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
  full,
  size = 'md',
}: ButtonProps) {
  const palette = getPalette(variant, disabled);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        size === 'lg' && styles.lg,
        full && styles.full,
        pressed && { opacity: 0.82 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={18} color={palette.text} style={{ marginRight: 8 }} /> : null}
          <Text style={[type.bodyBold, { color: palette.text }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

function getPalette(variant: Variant, disabled?: boolean) {
  if (disabled) {
    return { bg: colors.line, text: colors.inkMuted, border: colors.line };
  }
  switch (variant) {
    case 'secondary':
      return { bg: colors.paper, text: colors.leaf, border: colors.leaf };
    case 'ghost':
      return { bg: 'transparent', text: colors.leaf, border: 'transparent' };
    case 'danger':
      return { bg: colors.danger, text: colors.paper, border: colors.danger };
    default:
      return { bg: colors.leaf, text: colors.paper, border: colors.leaf };
  }
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  full: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
