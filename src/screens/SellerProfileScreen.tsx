import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/Avatar';
import { PlantCard } from '@/components/PlantCard';
import { Button } from '@/components/Button';
import { colors, type, spacing, radii, shadows } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SellerProfile'>;
type Route = RouteProp<RootStackParamList, 'SellerProfile'>;

export function SellerProfileScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state, getUser } = useApp();
  const user = getUser(route.params.userId);

  if (!user) return null;
  const listings = state.listings.filter((l) => l.sellerId === user.id);

  return (
    <Screen padded={false}>
      <FlatList
        data={listings}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        ListHeaderComponent={
          <View>
            <View style={styles.top}>
              <Avatar initials={user.initials} color={user.avatarColor} size={80} />
              <Text style={[type.displayMD, { marginTop: spacing.md }]}>{user.name}</Text>
              <Text style={[type.caption, { color: colors.inkMuted }]}>
                {user.handle} · {user.town}
              </Text>
              <Text style={[type.body, { color: colors.inkMuted, textAlign: 'center', marginTop: spacing.md }]}>
                {user.bio}
              </Text>

              <View style={styles.stats}>
                <Stat value={user.rating.toFixed(1)} label="Rating" icon="star" />
                <Stat value={user.trades} label="Trades" icon="leaf" />
                <Stat value={`${user.joinedMonths}m`} label="Joined" icon="calendar-outline" />
              </View>

              <View style={{ flexDirection: 'row', marginTop: spacing.lg, gap: spacing.sm }}>
                <Button label="Message" icon="chatbubble-ellipses-outline" variant="secondary" onPress={() => {}} style={{ flex: 1 }} />
                <Button label="Follow" icon="add" onPress={() => {}} style={{ flex: 1 }} />
              </View>
            </View>
            <Text style={[type.displayMD, { marginTop: spacing.xl, marginBottom: spacing.md }]}>
              Listings by {user.name}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <PlantCard
            listing={item}
            variant="row"
            onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
          />
        )}
      />
    </Screen>
  );
}

function Stat({ value, label, icon }: { value: string | number; label: string; icon: any }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={18} color={colors.leaf} />
      <Text style={[type.displayMD, { marginTop: 4 }]}>{value}</Text>
      <Text style={[type.small, { color: colors.inkMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', paddingTop: spacing.xl },
  stats: {
    flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between',
    backgroundColor: colors.paper, padding: spacing.lg, borderRadius: radii.lg,
    marginTop: spacing.lg, ...shadows.soft,
  },
  stat: { flex: 1, alignItems: 'center' },
});
