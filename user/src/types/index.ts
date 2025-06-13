export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Cart {
  id: string;
  name: string;
  type: 'personal' | 'group';
  products: CartProduct[];
  members: CartMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartProduct {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  viewCount: number;
  addToCartCount: number;
}

export interface CartMember {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  category: 'SHOPPING' | 'REVIEW' | 'SOCIAL' | 'COLLECTION' | 'ACHIEVEMENT';
  criteria: {
    type: 'PURCHASE' | 'REVIEW' | 'SHARE' | 'VISIT' | 'COLLECTION';
    target: number;
    current: number;
  };
  rewards: {
    type: 'POINTS' | 'VOUCHER' | 'BADGE' | 'CASHBACK';
    value: number;
    description: string;
  }[];
  startDate: Date;
  endDate: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  badge?: {
    id: string;
    name: string;
    image: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  };
  participants?: number;
  shareCount?: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  points: number;
  completedChallenges: number;
  badges: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  rank: number;
  progress: number;
  level: number;
}

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  streamUrl: string;
  status: 'UPCOMING' | 'LIVE' | 'ENDED';
  startTime: Date;
  endTime: Date;
  host: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
  };
  products: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    stock: number;
    soldCount: number;
    featured: boolean;
    order: number;
  }[];
  viewers: number;
  likes: number;
  shares: number;
  categories: string[];
  tags: string[];
  rating: number;
  reviews: number;
}

export interface Badge {
  id: string;
  name: string;
  image: string;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  dateEarned: Date;
  challenge: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'SHIPPING';
  value: number;
  minSpend?: number;
  expiryDate: Date;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  usedDate?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'SALE' | 'CHALLENGE' | 'LIVE' | 'PROMOTION';
  startDate: Date;
  endDate: Date;
  image: string;
  rewards?: {
    type: string;
    value: number;
    description: string;
  }[];
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  participants?: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'TEXT' | 'REACTION' | 'PRODUCT' | 'SYSTEM';
  timestamp: Date;
  productId?: string;
  reactionType?: string;
}

export interface LiveEventStats {
  viewers: number;
  likes: number;
  shares: number;
  sales: {
    total: number;
    products: {
      id: string;
      name: string;
      quantity: number;
      revenue: number;
    }[];
  };
} 