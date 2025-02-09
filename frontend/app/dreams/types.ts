export type CategoriesDTO = {
  data: Array<CategoryType> | []
}

export type CategoryType = {
  id: string;
  value: string;
  active: boolean;
}
