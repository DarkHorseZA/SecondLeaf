import React, { createContext, useContext, useMemo, useReducer, ReactNode } from 'react';
import { Listing, Conversation, Notification, User } from '@/types';
import { listings as seedListings } from '@/data/listings';
import { users as seedUsers, meId } from '@/data/users';
import { conversations as seedConvos, notifications as seedNotifs } from '@/data/conversations';

type ViewMode = 'list' | 'grid';

interface State {
  listings: Listing[];
  users: User[];
  conversations: Conversation[];
  notifications: Notification[];
  saved: Set<string>;
  viewMode: ViewMode;
  signedIn: boolean;
  me: User;
}

type Action =
  | { type: 'TOGGLE_SAVE'; id: string }
  | { type: 'SET_VIEW'; mode: ViewMode }
  | { type: 'ADD_LISTING'; listing: Listing }
  | { type: 'SEND_MESSAGE'; conversationId: string; text: string }
  | { type: 'MARK_READ'; conversationId: string }
  | { type: 'MARK_NOTIFS_READ' }
  | { type: 'SIGN_IN' }
  | { type: 'SIGN_OUT' };

const initialState: State = {
  listings: seedListings,
  users: seedUsers,
  conversations: seedConvos,
  notifications: seedNotifs,
  saved: new Set(['l5', 'l11']),
  viewMode: 'list',
  signedIn: true,
  me: seedUsers.find((u) => u.id === meId)!,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_SAVE': {
      const saved = new Set(state.saved);
      if (saved.has(action.id)) saved.delete(action.id);
      else saved.add(action.id);
      return { ...state, saved };
    }
    case 'SET_VIEW':
      return { ...state, viewMode: action.mode };
    case 'ADD_LISTING':
      return { ...state, listings: [action.listing, ...state.listings] };
    case 'SEND_MESSAGE': {
      const conversations = state.conversations.map((c) => {
        if (c.id !== action.conversationId) return c;
        const newMessage = {
          id: `m-${Date.now()}`,
          fromMe: true,
          text: action.text,
          time: 'Now',
        };
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: action.text,
          lastTime: 'Now',
        };
      });
      return { ...state, conversations };
    }
    case 'MARK_READ': {
      const conversations = state.conversations.map((c) =>
        c.id === action.conversationId ? { ...c, unread: 0 } : c,
      );
      return { ...state, conversations };
    }
    case 'MARK_NOTIFS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, unread: false })),
      };
    case 'SIGN_IN':
      return { ...state, signedIn: true };
    case 'SIGN_OUT':
      return { ...state, signedIn: false };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  getUser: (id: string) => User | undefined;
  getListing: (id: string) => Listing | undefined;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(
    () => ({
      state,
      dispatch,
      getUser: (id: string) => state.users.find((u) => u.id === id),
      getListing: (id: string) => state.listings.find((l) => l.id === id),
    }),
    [state],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
