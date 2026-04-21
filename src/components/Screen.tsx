import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  contentStyle?: ViewStyle;
  keyboardDismiss?: boolean;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  background = colors.cream,
  contentStyle,
  keyboardDismiss,
}: ScreenProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: background }]}>
      <StatusBar barStyle="dark-content" />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[padded && styles.padded, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardDismiss ? 'handled' : 'always'}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, padded && styles.padded, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  padded: { paddingHorizontal: 20 },
});
