import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PlantArt } from '@/components/PlantArt';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { PriceTag } from '@/components/PriceTag';
import { colors, type, spacing, radii, shadows } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ListingDetail'>;
type Route = RouteProp<RootStackParamList, 'ListingDetail'>;

export function ListingDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state, dispatch, getUser, getListing } = useApp();
  const listing = getListing(route.params.listingId);
  const seller = listing ? getUser(listing.sellerId) : undefined;

  if (!listing || !seller) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
        <Text style={{ padding: spacing.xl }}>Listing not found.</Text>
      </SafeAreaView>
    );
  }

  const saved = state.saved.has(listing.id);

  const onMessage = () => {
    const existing = state.conversations.find(
      (c) => c.userId === seller.id && c.listingId === listing.id,
    );
    if (existing) {
      navigation.navigate('Chat', { conversationId: existing.id });
    } else if (state.conversations[0]) {
      navigation.navigate('Chat', { conversationId: state.conversations[0].id });
    }
  };

  const onShare = () => {
    if (Platform.OS === 'web') return;
    Share.share({
      title: listing.title,
      message: `${listing.title} on Second Leaf — ${listing.town}. secondleaf.co.uk/listings/${listing.id}`,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <PlantArt seed={listing.imageSeed} size={400} rounded={0} />
        </View>

        <View style={styles.overlay}>
          <Pressable style={styles.circle} onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable style={styles.circle} onPress={onShare} hitSlop={8}>
              <Ionicons name="share-outline" size={20} color={colors.ink} />
            </Pressable>
            <Pressable
              style={styles.circle}
              onPress={() => dispatch({ type: 'TOGGLE_SAVE', id: listing.id })}
              hitSlop={8}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={20}
                color={saved ? colors.danger : colors.ink}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <PriceTag listing={listing} />
            <View style={styles.likesRow}>
              <Ionicons name="heart" size={14} color={colors.danger} />
              <Text style={[type.caption, { color: colors.inkMuted, marginLeft: 4 }]}>{listing.likes} saved</Text>
            </View>
          </View>
          <Text style={[type.displayXL, { marginTop: spacing.sm }]}>{listing.title}</Text>
          <Text style={[type.body, { color: colors.inkMuted, fontStyle: 'italic' }]}>{listing.species}</Text>

          <View style={styles.metaRow}>
            <MetaPill icon="location-outline" label={`${listing.town} · ${listing.distanceMiles.toFixed(1)} mi`} />
            <MetaPill icon="time-outline" label={listing.postedAgo} />
          </View>

          <Text style={[type.bodyBold, { marginTop: spacing.xl }]}>About this plant</Text>
          <Text style={[type.body, { color: colors.ink, marginTop: spacing.sm, lineHeight: 22 }]}>
            {listing.description}
          </Text>

          {listing.mode === 'trade' && listing.tradeFor ? (
            <View style={styles.tradeBox}>
              <Ionicons name="swap-horizontal" size={18} color={'#2D5D8A'} />
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={[type.caption, { color: '#2D5D8A', fontWeight: '700' }]}>Open to swap for</Text>
                <Text style={[type.body, { color: colors.ink }]}>{listing.tradeFor}</Text>
              </View>
            </View>
          ) : null}

          <Text style={[type.bodyBold, { marginTop: spacing.xl }]}>Details</Text>
          <View style={styles.detailsGrid}>
            <Detail icon="sunny-outline" label="Light" value={cap(listing.light)} />
            <Detail icon="water-outline" label="Care" value={cap(listing.care)} />
            <Detail icon="resize-outline" label="Height" value={listing.height} />
            <Detail
              icon="paw-outline"
              label="Pet friendly"
              value={listing.petFriendly ? 'Yes' : 'No'}
            />
            <Detail icon="flower-outline" label="Category" value={cap(listing.category)} />
            <Detail icon="cube-outline" label="Pot" value={listing.potIncluded ? 'Included' : 'Not included'} />
          </View>

          <Text style={[type.bodyBold, { marginTop: spacing.xl }]}>Seller</Text>
          <Pressable
            style={styles.seller}
            onPress={() => navigation.navigate('SellerProfile', { userId: seller.id })}
          >
            <Avatar initials={seller.initials} color={seller.avatarColor} size={48} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={type.bodyBold}>{seller.name}</Text>
              <Text style={[type.caption, { color: colors.inkMuted }]}>
                {seller.handle} · {seller.town} · {seller.rating.toFixed(1)}★
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
          </Pressable>

          <View style={styles.safety}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.leaf} />
            <Text style={[type.small, { color: colors.inkMuted, marginLeft: 6, flex: 1 }]}>
              Second Leaf tip: keep chats and payments in-app for trusted trades.
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.actionBar}>
        <View style={styles.actionInner}>
          <Button
            label="Message"
            icon="chatbubble-ellipses-outline"
            variant="secondary"
            onPress={onMessage}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <Button
            label={listing.mode === 'sell' ? 'Reserve' : listing.mode === 'trade' ? 'Offer a swap' : 'Request'}
            icon={listing.mode === 'sell' ? 'bag-check-outline' : listing.mode === 'trade' ? 'swap-horizontal' : 'hand-left-outline'}
            onPress={onMessage}
            style={{ flex: 1 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function MetaPill({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.metaPill}>
      <Ionicons name={icon} size={12} color={colors.inkMuted} />
      <Text style={[type.small, { color: colors.inkMuted, marginLeft: 4 }]}>{label}</Text>
    </View>
  );
}

function Detail({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={colors.leaf} />
      </View>
      <View>
        <Text style={[type.small, { color: colors.inkMuted }]}>{label}</Text>
        <Text style={type.bodyBold}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 340, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.leafMuted },
  overlay: {
    position: 'absolute', top: 48, left: spacing.lg, right: spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  circle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.paper,
    alignItems: 'center', justifyContent: 'center', ...shadows.soft,
  },
  sheet: {
    backgroundColor: colors.cream, marginTop: -24, paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl,
  },
  likesRow: { flexDirection: 'row', alignItems: 'center' },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: radii.pill, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line,
  },
  tradeBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E4EFFA',
    padding: spacing.md, borderRadius: radii.md, marginTop: spacing.lg,
  },
  detailsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md, gap: spacing.md,
  },
  detail: {
    flexDirection: 'row', alignItems: 'center', width: '47%',
    backgroundColor: colors.paper, padding: spacing.md, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.line,
  },
  detailIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.leafMuted,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  seller: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper,
    padding: spacing.md, borderRadius: radii.md, marginTop: spacing.sm,
    borderWidth: 1, borderColor: colors.line,
  },
  safety: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: spacing.md, marginTop: spacing.xl, borderRadius: radii.md,
    backgroundColor: colors.leafMuted,
  },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.paper,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  actionInner: {
    flexDirection: 'row', paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
  },
});
