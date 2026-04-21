import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { colors, type, spacing, radii } from '@/theme';
import { useApp } from '@/context/AppContext';
import { Notification } from '@/types';

const iconFor: Record<Notification['kind'], keyof typeof Ionicons.glyphMap> = {
  message: 'chatbubble-ellipses-outline',
  offer: 'swap-horizontal',
  like: 'heart-outline',
  system: 'shield-checkmark-outline',
};

export function NotificationsScreen() {
  const { state, dispatch } = useApp();
  React.useEffect(() => {
    dispatch({ type: 'MARK_NOTIFS_READ' });
  }, []);
  return (
    <Screen padded={false}>
      <FlatList
        data={state.notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}
        ListEmptyComponent={<EmptyState title="You're all caught up" body="Messages, offers, and likes will show here." />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name={iconFor[item.kind]} size={18} color={colors.leaf} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={type.bodyBold}>{item.title}</Text>
                <Text style={[type.small, { color: colors.inkMuted }]}>{item.time}</Text>
              </View>
              <Text style={[type.body, { color: colors.ink, marginTop: 2 }]}>{item.body}</Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.paper, padding: spacing.md, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.line,
  },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.leafMuted,
    alignItems: 'center', justifyContent: 'center',
  },
});
