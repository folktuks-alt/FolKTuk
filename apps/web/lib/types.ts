export type Profile = {
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  communityId?: string | null;
  published: boolean;
  createdAt: string;
  likes?: { id: string; userId?: string }[];
  reactions?: { id: string; userId: string; type: 'LIKE' | 'DISLIKE' }[];
  author?: { id: string; email: string; profile?: Profile | null };
  community?: { name: string; slug: string } | null;
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
};

export type PostLikedEvent = { postId: string; count: number };

export type Notification = {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW';
  targetId: string;
  read: boolean;
  createdAt: string;
  actor: { id: string; profile?: Profile | null };
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  description?: string | null;
  topics?: string[];
  rules?: string[];
  bannerUrl?: string | null;
  avatarUrl?: string | null;
  memberCount?: number;
  posts?: Page<Post>;
};

export type Page<T> = { data: T[]; total: number; page: number; limit: number };
export type CursorPage<T> = { items: T[]; nextCursor: string | null };
export type TrendingTopic = { topic: string; count: number };
export type TrendingTag = { tag: string; count: number };
export type SearchResult = {
  query: string;
  type: 'all' | 'posts' | 'communities' | 'tags';
  posts: Post[];
  communities: Community[];
  users: User[];
  tags: TrendingTag[];
};
export type User = {
  id: string;
  email: string;
  createdAt: string;
  profile?: Profile | null;
  followerCount?: number;
  followingCount?: number;
};
