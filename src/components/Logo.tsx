import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, ClipPath, G, Rect } from 'react-native-svg';
import { colors, type, spacing } from '@/theme';

interface LogoMarkProps {
  size?: number;
  tone?: 'color' | 'light' | 'dark';
}

export function LogoMark({ size = 40, tone = 'color' }: LogoMarkProps) {
  const bgFrom = tone === 'light' ? colors.paper : colors.leafDark;
  const bgTo = tone === 'light' ? colors.leafMuted : colors.leaf;
  const leafFill = tone === 'light' ? colors.leaf : colors.paper;
  const backLeaf = tone === 'light' ? colors.leafMuted : colors.leafLight;
  const veinColor = tone === 'light' ? colors.leafDark : colors.leaf;
  const corner = size * 0.22;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="sl-bg" x1="0" y1="0" x2="0.6" y2="1">
          <Stop offset="0" stopColor={bgFrom} />
          <Stop offset="1" stopColor={bgTo} />
        </LinearGradient>
        <ClipPath id="sl-leaf-clip">
          <Path d="M32 7
                   C 48 10, 54 22, 52 36
                   C 50 50, 40 56, 32 57
                   C 24 56, 14 50, 12 36
                   C 10 22, 16 10, 32 7 Z"
                transform="rotate(-15 32 32)" />
        </ClipPath>
      </Defs>

      {/* Rounded background */}
      <Rect x="0" y="0" width="64" height="64" rx={corner} fill="url(#sl-bg)" />

      {/* Back leaf (accent) */}
      <Path
        d="M32 8
           C 48 12, 54 22, 52 36
           C 50 50, 40 56, 32 57
           C 24 56, 14 50, 12 36
           C 10 22, 16 12, 32 8 Z"
        transform="rotate(-40 32 32) scale(0.9) translate(3 3)"
        fill={backLeaf}
        opacity={0.55}
      />

      {/* Front leaf */}
      <Path
        d="M32 7
           C 48 10, 54 22, 52 36
           C 50 50, 40 56, 32 57
           C 24 56, 14 50, 12 36
           C 10 22, 16 10, 32 7 Z"
        transform="rotate(-15 32 32)"
        fill={leafFill}
      />

      {/* Veins clipped to front leaf */}
      <G clipPath="url(#sl-leaf-clip)">
        {/* Central vein */}
        <Path
          d="M32 57 L32 7"
          transform="rotate(-15 32 32)"
          stroke={veinColor}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
        {/* Side veins */}
        {[0.28, 0.48, 0.68].map((t, i) => {
          const y = 57 - (57 - 7) * t;
          const spread = Math.sin(t * Math.PI) * 14;
          return (
            <G key={i} transform="rotate(-15 32 32)">
              <Path d={`M32 ${y} L${32 + spread} ${y - spread * 0.35}`} stroke={veinColor} strokeOpacity={0.7} strokeWidth={1} strokeLinecap="round" />
              <Path d={`M32 ${y} L${32 - spread} ${y - spread * 0.35}`} stroke={veinColor} strokeOpacity={0.7} strokeWidth={1} strokeLinecap="round" />
            </G>
          );
        })}
      </G>
    </Svg>
  );
}

interface LogoProps {
  size?: number;
  tone?: 'color' | 'light' | 'dark';
  showTagline?: boolean;
}

export function Logo({ size = 40, tone = 'color', showTagline = false }: LogoProps) {
  const wordColor = tone === 'light' ? colors.paper : colors.ink;
  const accentColor = tone === 'light' ? colors.sprout : colors.leaf;
  return (
    <View style={styles.row}>
      <LogoMark size={size} tone={tone} />
      <View style={{ marginLeft: spacing.sm }}>
        <Text style={[type.displayLG, { color: wordColor, fontSize: size * 0.58 }]}>
          Second<Text style={{ color: accentColor }}>Leaf</Text>
        </Text>
        {showTagline ? (
          <Text style={[type.caption, { color: tone === 'light' ? colors.leafMuted : colors.inkMuted }]}>
            Give plants a second home.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
