export type TokenDTO = {
  name: string;
  ticker: string;
  imageUrl: string;
  description: string;
  website?: any;
  twitter?: string;
  categories?: Array<string> | [];
  address?: string;
  telegram?: string;
}

export type CategoriesDTO = {
  data: Array<CategoryType> | []
}

export type CategoryType = {
  id: string;
  value: string;
  label: string;
  name: string;
}

export type Field = 'name' | 'ticker' | 'imageUrl' | 'description' | 'website';
