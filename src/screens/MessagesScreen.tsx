import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/Avatar';
import { EmptyState } from '@/components/EmptyState';
import { PlantArt } from '@/components/PlantArt';
import { colors, type, spacing, radii } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MessagesScreen() {
  const navigation = useNavigation<Nav>();
  const { state, getUser, getListing } = useApp();

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={type.displayLG}>Messages</Text>
        <Text style={[type.caption, { color: colors.inkMuted }]}>
          Chat with growers nearby. Always meet in public spots.
        </Text>
      </View>
      <FlatList
        data={state.conversations}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No conversations yet"
            body="When you message a seller or receive an offer, it shows up here."
          />
        }
        renderItem={({ item }) => {
          const user = getUser(item.userId);
          const listing = getListing(item.listingId);
          if (!user || !listing) return null;
          return (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
            >
              <Avatar initials={user.initials} color={user.avatarColor} size={48} />
              <View style={styles.body}>
                <View style={styles.topRow}>
                  <Text style={type.bodyBold}>{user.name}</Text>
                  <Text style={[type.small, { color: colors.inkMuted }]}>{item.lastTime}</Text>
                </View>
                <Text style={[type.caption, { color: colors.inkMuted, marginTop: 2 }]} numberOfLines={1}>
                  About: {listing.title}
                </Text>
                <Text style={[type.body, { marginTop: 2 }]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              <View style={styles.right}>
                <PlantArt seed={listing.imageSeed} size={44} rounded={10} />
                {item.unread ? (
                  <View style={styles.unread}>
                    <Text style={[type.small, { color: colors.paper }]}>{item.unread}</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md,
  },
  body: { flex: 1, marginLeft: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  right: { alignItems: 'flex-end', marginLeft: spacing.sm, gap: spacing.xs },
  sep: { height: 1, backgroundColor: colors.line },
  unread: {
    minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6,
    backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
});
