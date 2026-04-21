import { NavigatorScreenParams } from '@react-navigation/native';

export type TabsParamList = {
  Browse: undefined;
  Search: undefined;
  Sell: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  ListingDetail: { listingId: string };
  Chat: { conversationId: string };
  CreateListing: undefined;
  Notifications: undefined;
  SignIn: undefined;
  SellerProfile: { userId: string };
  Settings: undefined;
};
