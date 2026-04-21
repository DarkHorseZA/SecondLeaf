import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect, Ellipse } from 'react-native-svg';
import { colors } from '@/theme';

/**
 * Seeded SVG plant illustrations — no remote images required.
 * Each seed produces a deterministic leafy silhouette in a pot.
 */

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const palettes = [
  [colors.leaf, colors.leafLight, colors.sprout],
  [colors.moss, colors.leafLight, '#8DC893'],
  [colors.leafDark, colors.leaf, colors.leafLight],
  [colors.moss, colors.sprout, colors.leafMuted],
];

const bgs = [colors.leafMuted, '#EDF5E9', '#E1EEDC', '#F1F7EC'];

interface PlantArtProps {
  seed: string;
  size?: number;
  rounded?: number;
}

export function PlantArt({ seed, size = 180, rounded = 18 }: PlantArtProps) {
  const { palette, bg, leaves, potColor } = useMemo(() => {
    const r = hash(seed);
    const palette = palettes[Math.floor(r() * palettes.length)];
    const bg = bgs[Math.floor(r() * bgs.length)];
    const potColor = ['#B9795C', '#C98F6C', '#8E5A42', '#D6A37C'][Math.floor(r() * 4)];
    const count = 4 + Math.floor(r() * 5);
    const leaves = Array.from({ length: count }, () => ({
      angle: (r() - 0.5) * 120,
      length: 28 + r() * 34,
      width: 14 + r() * 16,
      color: palette[Math.floor(r() * palette.length)],
      curve: (r() - 0.5) * 20,
      x: 100 + (r() - 0.5) * 28,
      y: 120 + (r() - 0.5) * 10,
    }));
    return { palette, bg, leaves, potColor };
  }, [seed]);

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: rounded, backgroundColor: bg }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id={`pot-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={potColor} />
            <Stop offset="1" stopColor="#6F4A34" />
          </LinearGradient>
        </Defs>
        {/* Sun / halo */}
        <Circle cx={155} cy={45} r={24} fill="#FFFFFF" opacity={0.45} />
        {/* Leaves */}
        {leaves.map((l, i) => (
          <Path
            key={i}
            d={`M ${l.x} ${l.y}
                C ${l.x + l.curve} ${l.y - l.length * 0.7},
                  ${l.x + l.width} ${l.y - l.length},
                  ${l.x + l.width * 0.2 + Math.cos((l.angle * Math.PI) / 180) * l.length} ${l.y - l.length - 10}
                C ${l.x + l.width * 0.5} ${l.y - l.length * 0.5},
                  ${l.x + l.width} ${l.y - l.length * 0.3},
                  ${l.x} ${l.y} Z`}
            fill={l.color}
            opacity={0.92}
            transform={`rotate(${l.angle} ${l.x} ${l.y})`}
          />
        ))}
        {/* Pot */}
        <Path
          d="M 70 125 L 130 125 L 124 172 Q 100 180 76 172 Z"
          fill={`url(#pot-${seed})`}
        />
        <Ellipse cx={100} cy={125} rx={30} ry={6} fill="#3E2618" opacity={0.35} />
        <Rect x={70} y={123} width={60} height={6} fill={potColor} opacity={0.7} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
