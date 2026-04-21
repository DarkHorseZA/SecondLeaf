import { Conversation, Notification } from '@/types';

export const conversations: Conversation[] = [
  {
    id: 'c1',
    userId: 'u1',
    listingId: 'l1',
    lastMessage: 'Lovely — fancy meeting at the cafe by Stokes Croft?',
    lastTime: '09:42',
    unread: 2,
    messages: [
      { id: 'm1', fromMe: true, text: 'Hi! Is your Monstera still available?', time: 'Yesterday' },
      { id: 'm2', fromMe: false, text: 'Yes she is, still looking for a new home 🌱', time: 'Yesterday' },
      { id: 'm3', fromMe: true, text: 'Amazing — could we pick up Saturday?', time: '08:15' },
      { id: 'm4', fromMe: false, text: 'Saturday works!', time: '09:41' },
      { id: 'm5', fromMe: false, text: 'Lovely — fancy meeting at the cafe by Stokes Croft?', time: '09:42' },
    ],
  },
  {
    id: 'c2',
    userId: 'u2',
    listingId: 'l2',
    lastMessage: 'Happy to swap for the philodendron cutting.',
    lastTime: 'Tue',
    unread: 0,
    messages: [
      { id: 'm1', fromMe: true, text: 'Would you swap the Pilea pups for a philodendron cutting?', time: 'Mon' },
      { id: 'm2', fromMe: false, text: 'Happy to swap for the philodendron cutting.', time: 'Tue' },
    ],
  },
  {
    id: 'c3',
    userId: 'u3',
    listingId: 'l3',
    lastMessage: 'I can drop by on Thursday evening.',
    lastTime: 'Mon',
    unread: 1,
    messages: [
      { id: 'm1', fromMe: false, text: 'Hi! Tomato seedlings still up for grabs?', time: 'Sun' },
      { id: 'm2', fromMe: true, text: 'Yep — six left. Free, just collection.', time: 'Mon' },
      { id: 'm3', fromMe: false, text: 'I can drop by on Thursday evening.', time: 'Mon' },
    ],
  },
];

export const notifications: Notification[] = [
  { id: 'n1', kind: 'message', title: 'Amelia replied', body: '“Lovely — fancy meeting at the cafe…”', time: '9:42', unread: true },
  { id: 'n2', kind: 'offer', title: 'New swap offer', body: 'Dev offered you a Pilea pup.', time: 'Tue', unread: true },
  { id: 'n3', kind: 'like', title: 'Your listing is popular', body: '“Japanese Maple — potted” got 10 new likes.', time: 'Mon', unread: false },
  { id: 'n4', kind: 'system', title: 'Trust boost', body: 'Verify your email to earn the Trusted Grower badge.', time: 'Sun', unread: false },
];
