import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radii } from '@/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
}

export function EmptyState({ icon = 'leaf-outline', title, body }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Ionicons name={icon} size={32} color={colors.leaf} />
      </View>
      <Text style={[type.displayMD, { marginTop: spacing.md, textAlign: 'center' }]}>{title}</Text>
      {body ? (
        <Text style={[type.body, { color: colors.inkMuted, textAlign: 'center', marginTop: spacing.sm }]}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  bubble: {
    width: 72, height: 72, borderRadius: radii.xl,
    backgroundColor: colors.leafMuted, alignItems: 'center', justifyContent: 'center',
  },
});
