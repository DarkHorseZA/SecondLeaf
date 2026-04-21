import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Avatar } from '@/components/Avatar';
import { PlantArt } from '@/components/PlantArt';
import { PriceTag } from '@/components/PriceTag';
import { colors, type, spacing, radii } from '@/theme';
import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
type Route = RouteProp<RootStackParamList, 'Chat'>;

export function ChatScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state, dispatch, getUser, getListing } = useApp();
  const conversation = state.conversations.find((c) => c.id === route.params.conversationId);
  const listRef = useRef<FlatList<any>>(null);
  const [draft, setDraft] = useState('');

  React.useEffect(() => {
    if (conversation?.unread) dispatch({ type: 'MARK_READ', conversationId: conversation.id });
  }, [conversation?.id]);

  if (!conversation) return null;
  const user = getUser(conversation.userId);
  const listing = getListing(conversation.listingId);
  if (!user || !listing) return null;

  const send = () => {
    if (!draft.trim()) return;
    dispatch({ type: 'SEND_MESSAGE', conversationId: conversation.id, text: draft.trim() });
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar initials={user.initials} color={user.avatarColor} size={28} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={type.bodyBold}>{user.name}</Text>
            <Text style={[type.small, { color: colors.inkMuted }]}>{user.town}</Text>
          </View>
        </View>
      ),
    });
  }, [navigation, user]);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.cream }}>
      <Pressable
        style={styles.listingBar}
        onPress={() => navigation.navigate('ListingDetail', { listingId: listing.id })}
      >
        <PlantArt seed={listing.imageSeed} size={44} rounded={8} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={type.bodyBold} numberOfLines={1}>{listing.title}</Text>
          <PriceTag listing={listing} compact />
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={listRef}
          data={conversation.messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[type.body, { color: item.fromMe ? colors.paper : colors.ink }]}>
                {item.text}
              </Text>
              <Text
                style={[
                  type.small,
                  { color: item.fromMe ? '#E6F3EA' : colors.inkMuted, marginTop: 4, alignSelf: 'flex-end' },
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        <View style={styles.composer}>
          <Pressable style={styles.composerBtn} hitSlop={6}>
            <Ionicons name="add-circle-outline" size={22} color={colors.leaf} />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Message…"
            placeholderTextColor={colors.inkMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <Pressable style={[styles.sendBtn, !draft.trim() && { opacity: 0.4 }]} onPress={send}>
            <Ionicons name="send" size={18} color={colors.paper} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listingBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper,
    padding: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.sm,
    borderRadius: radii.md, borderWidth: 1, borderColor: colors.line,
  },
  messages: { padding: spacing.lg, gap: spacing.sm },
  bubble: {
    maxWidth: '80%', padding: spacing.md, borderRadius: radii.lg, marginBottom: spacing.sm,
  },
  bubbleMe: { backgroundColor: colors.leaf, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: colors.paper, alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.line },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md,
    backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line,
  },
  composerBtn: { padding: 6 },
  input: {
    flex: 1, minHeight: 40, maxHeight: 120, backgroundColor: colors.cream,
    borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 10,
    marginHorizontal: spacing.sm, fontSize: 15, color: colors.ink,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.leaf,
    alignItems: 'center', justifyContent: 'center',
  },
});
