export interface TagNode {
  name: string;
  children?: TagNode[];
  data?: string;
}

export interface SavedTree {
  id: number;
  tree: TagNode;
}
