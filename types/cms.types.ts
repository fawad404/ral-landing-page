export type ResourceType = 'blog' | 'guidance' | 'directory';

export interface Resource {
  _id: string;
  title: string;
  content: string;
  type: ResourceType;
  slug: string;
  isPublished: boolean;
  authorId: string | { _id: string; email: string; firstName?: string; lastName?: string } | null;
  tags: string[];
  excerpt?: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceDto {
  title: string;
  content: string;
  type: ResourceType;
  slug?: string;
  tags?: string[];
  excerpt?: string;
  featuredImage?: string;
}

export interface UpdateResourceDto extends Partial<CreateResourceDto> {}
