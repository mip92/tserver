# Brands Module

Модуль для управления брендами с поддержкой пагинации, сортировки и фильтрации.

## GraphQL Queries

### Получить все бренды

```graphql
query {
  brands {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Получить бренды с пагинацией

```graphql
query {
  brandsWithPagination(
    query: { skip: 0, take: 10, sortBy: NAME, sortOrder: ASC, search: "brand" }
  ) {
    rows {
      id
      name
      createdAt
      updatedAt
    }
    total
  }
}
```

### Получить бренд по ID

```graphql
query {
  brand(id: 1) {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Получить бренд с продуктами

```graphql
query {
  brandWithProducts(id: 1) {
    id
    name
    createdAt
    updatedAt
    products {
      id
      name
      type
      brandId
    }
  }
}
```

### Поиск брендов по имени

```graphql
query {
  brandsByName(name: "brand") {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Получить бренды по ID

```graphql
query {
  brandsByIds(ids: [1, 2, 3]) {
    id
    name
    createdAt
    updatedAt
  }
}
```

## GraphQL Mutations

### Создать бренд (только для админов)

```graphql
mutation {
  createBrand(input: { name: "New Brand" }) {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Обновить бренд (только для админов)

```graphql
mutation {
  updateBrand(id: 1, input: { name: "Updated Brand Name" }) {
    id
    name
    createdAt
    updatedAt
  }
}
```

### Удалить бренд (только для админов)

```graphql
mutation {
  deleteBrand(id: 1) {
    id
    name
    createdAt
    updatedAt
  }
}
```

## Параметры пагинации

- `skip` - количество записей для пропуска (по умолчанию: 0)
- `take` - количество записей для получения (по умолчанию: 10, максимум: 100)
- `sortBy` - поле для сортировки (ID, NAME, CREATED_AT, UPDATED_AT)
- `sortOrder` - порядок сортировки (ASC, DESC)
- `search` - поиск по названию бренда
- `ids` - массив ID брендов для фильтрации

## Права доступа

- **Чтение**: доступно всем пользователям
- **Создание/Обновление/Удаление**: только для пользователей с ролью ADMIN

