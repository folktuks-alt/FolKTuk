export type Profile = {
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  communityId?: string | null;
  published: boolean;
  createdAt: string;
  likes?: { id: string }[];
};

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  posts?: Page<Post>;
};

export type Page<T> = { data: T[]; total: number; page: number; limit: number };
export type User = { id: string; email: string; createdAt: string; profile?: Profile | null };
