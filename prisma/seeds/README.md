# Database Seeds

## Overview
This directory contains seed files for populating the database with initial data.

## Recent Changes (Latest Update)

### Table Renaming and Structure Improvements
- **Renamed table**: `boxes_products` → `inventory_items`
- **Added box hierarchy support**: Boxes can now contain other boxes
- **Improved data structure**: Added fields for better inventory management

### New Schema Structure

#### Box Model (Enhanced)
```prisma
model Box {
  id              Int              @id @default(autoincrement())
  boxTypeId       Int?
  name            String?          // Box name/description
  description     String?          // Additional box details
  parentBoxId     Int?             // Parent box ID for hierarchy
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  boxType         BoxType?         @relation(fields: [boxTypeId], references: [id])
  parentBox       Box?             @relation("BoxHierarchy", fields: [parentBoxId], references: [id])
  childBoxes      Box[]            @relation("BoxHierarchy")
  inventoryItems  InventoryItem[]
}
```

#### InventoryItem Model (Renamed from BoxProduct)
```prisma
model InventoryItem {
  id            Int       @id @default(autoincrement())
  name          String
  quantity      Int
  date          DateTime?
  boxId         Int?
  productId     Int
  purchasePrice Int       @default(0)
  status        String?
  notes         String?   // Additional notes
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  box           Box?      @relation(fields: [boxId], references: [id])
  product       Product   @relation(fields: [productId], references: [id])
}
```

### Benefits of New Structure
1. **Better naming**: `inventory_items` is more descriptive than `boxes_products`
2. **Hierarchical organization**: Boxes can be nested (e.g., "Large Box" contains "Small Box 1", "Small Box 2")
3. **Improved data management**: Added fields for better organization and tracking
4. **Scalability**: Easier to manage complex inventory structures

### Migration Required
To apply these changes, you need to:
1. Run the Prisma migration: `npx prisma migrate dev`
2. Update the Prisma client: `npx prisma generate`
3. Update your application code to use the new model names

## Seed Files
- `roles.seed.ts` - User roles and permissions
- `users.seed.ts` - Initial user accounts
- `brands.seed.ts` - Product brands
- `box-types.seed.ts` - Box type definitions
- `products.seed.ts` - Product catalog
- `boxes.seed.ts` - Box definitions
- `inventory-items.seed.ts` - Inventory items (renamed from box-products)

## Running Seeds
```bash
npm run seed
# or
npx ts-node prisma/seeds/index.ts
```
