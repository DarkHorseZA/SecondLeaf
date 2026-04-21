import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { RootStackParamList, TabsParamList } from './types';
import { colors, type, spacing } from '@/theme';
import { useApp } from '@/context/AppContext';

import { BrowseScreen } from '@/screens/BrowseScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { SellScreen } from '@/screens/SellScreen';
import { MessagesScreen } from '@/screens/MessagesScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ListingDetailScreen } from '@/screens/ListingDetailScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { CreateListingScreen } from '@/screens/CreateListingScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { SellerProfileScreen } from '@/screens/SellerProfileScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Tabs = createBottomTabNavigator<TabsParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabBarBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={[type.small, { color: colors.paper }]}>{count}</Text>
    </View>
  );
}

function TabsNavigator() {
  const { state } = useApp();
  const unreadMessages = state.conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.leaf,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused, color, size }) => {
          const icon = getIcon(route.name, focused);
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Browse" component={BrowseScreen} />
      <Tabs.Screen name="Search" component={SearchScreen} />
      <Tabs.Screen
        name="Sell"
        component={SellScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.sellIcon, focused && styles.sellIconFocused]}>
              <Ionicons name="add" size={26} color={colors.paper} />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
              <TabBarBadge count={unreadMessages} />
            </View>
          ),
        }}
      />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function getIcon(route: keyof TabsParamList, focused: boolean): keyof typeof Ionicons.glyphMap {
  switch (route) {
    case 'Browse': return focused ? 'leaf' : 'leaf-outline';
    case 'Search': return focused ? 'search' : 'search-outline';
    case 'Messages': return focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
    case 'Profile': return focused ? 'person' : 'person-outline';
    default: return 'leaf-outline';
  }
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.cream },
          headerTitleStyle: { ...type.title, color: colors.ink },
          headerTintColor: colors.leafDark,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ListingDetail" component={ListingDetailScreen} options={{ headerTransparent: true, headerTitle: '' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerTitle: 'Conversation' }} />
        <Stack.Screen name="CreateListing" component={CreateListingScreen} options={{ headerTitle: 'New listing', presentation: 'modal' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerTitle: 'Notifications' }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SellerProfile" component={SellerProfileScreen} options={{ headerTitle: '' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
    backgroundColor: colors.paper,
    borderTopColor: colors.line,
  },
  label: { ...type.small, marginTop: 2 },
  sellIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.leaf,
    alignItems: 'center', justifyContent: 'center', marginTop: -10,
    shadowColor: colors.leafDark, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sellIconFocused: { backgroundColor: colors.leafDark },
  badge: {
    position: 'absolute', top: -4, right: -8,
    minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 4,
    backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center',
  },
});
