import { registerEnumType } from "@nestjs/graphql";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum ProductSortField {
  ID = "id",
  NAME = "name",
  TYPE = "type",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export enum BrandSortField {
  ID = "id",
  NAME = "name",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export enum BoxTypeSortField {
  ID = "id",
  NAME = "name",
  TYPE = "type",
  QUANTITY = "quantity",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

registerEnumType(SortOrder, {
  name: "SortOrder",
  description: "Порядок сортировки",
});

registerEnumType(ProductSortField, {
  name: "ProductSortField",
  description: "Поле для сортировки продуктов",
});

registerEnumType(BrandSortField, {
  name: "BrandSortField",
  description: "Поле для сортировки брендов",
});

registerEnumType(BoxTypeSortField, {
  name: "BoxTypeSortField",
  description: "Поле для сортировки типов коробок",
});
