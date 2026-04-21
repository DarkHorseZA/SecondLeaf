import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { spacing, type } from '@/theme';
import { colors as v2Colors } from '@/theme/colors.v2';

/**
 * v2 mark — stylised leaf/number-two shape in vibrant green,
 * echoing the live secondleaf.co.uk wordmark.
 */

interface LogoMarkProps {
  size?: number;
  tone?: 'color' | 'light' | 'dark';
}

export function LogoMarkV2({ size = 36, tone = 'color' }: LogoMarkProps) {
  const leaf = tone === 'light' ? v2Colors.paper : v2Colors.leaf;
  const dark = tone === 'light' ? v2Colors.leafMuted : v2Colors.leafDark;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <LinearGradient id="sl2-leaf" x1="0.1" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={leaf} />
          <Stop offset="1" stopColor={dark} />
        </LinearGradient>
      </Defs>
      {/* Curved leaf body forming a "2" silhouette */}
      <Path
        d="M10 15
           C 10 7, 20 4, 28 6
           C 38 9, 42 20, 36 28
           C 30 36, 18 34, 14 40
           L 38 40
           L 38 44
           L 8 44
           L 8 40
           C 10 30, 30 30, 32 22
           C 34 14, 22 12, 18 18
           C 16 20, 15 18, 14 17
           C 13 16, 11 16, 10 15 Z"
        fill="url(#sl2-leaf)"
      />
      {/* Small leaf accent at the top-right of the "2" */}
      <Path
        d="M30 6
           C 36 4, 42 7, 42 12
           C 42 17, 36 18, 32 15
           C 30 13, 30 9, 30 6 Z"
        fill={leaf}
        opacity={0.85}
      />
      {/* Vein on the accent leaf */}
      <Path d="M31 14 C 34 11, 37 9, 41 8" stroke={dark} strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.75} />
    </Svg>
  );
}

interface LogoProps {
  size?: number;
  tone?: 'color' | 'light' | 'dark';
  showTagline?: boolean;
  compact?: boolean;
}

export function LogoV2({ size = 36, tone = 'color', showTagline = false, compact = false }: LogoProps) {
  const wordColor = tone === 'light' ? v2Colors.paper : v2Colors.bark;
  const accentColor = tone === 'light' ? v2Colors.sprout : v2Colors.leaf;
  return (
    <View style={styles.row}>
      <LogoMarkV2 size={size} tone={tone} />
      {compact ? null : (
        <View style={{ marginLeft: spacing.sm }}>
          <Text style={[type.displayLG, { color: wordColor, fontSize: size * 0.62 }]}>
            Second<Text style={{ color: accentColor }}>Leaf</Text>
          </Text>
          {showTagline ? (
            <Text style={[type.caption, { color: tone === 'light' ? v2Colors.leafMuted : v2Colors.inkMuted }]}>
              Give plants a second home.
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
