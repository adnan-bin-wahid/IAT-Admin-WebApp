# Integration Guide: Supabase Database Schema & Client Sync

This document contains the full database schema and the integration guidelines for synchronizing the Islamic Amal Tracker (IAT) Supplication (Dua) library data with the mobile app (or any other client section).

---

## 1. Full Database Schema (Prisma)

Below is the complete database schema representing the Supabase PostgreSQL structure. It defines books, indexes, categories, and supplication items, along with bilingual support, app visibility toggles, and version increments.

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum DuaStatus {
  draft
  published
  archived
}

model DuaBook {
  id              String      @id @default(cuid())
  nameBn          String
  nameEn          String
  subtitleBn      String?
  subtitleEn      String?
  descriptionBn   String?     @db.Text
  descriptionEn   String?     @db.Text
  slug            String      @unique
  icon            String?
  coverImage      String?
  accentColor     String?
  displayOrder    Int         @default(0)
  status          DuaStatus   @default(draft)
  isVisibleInApp  Boolean     @default(true)
  version         Int         @default(1)
  publishedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  indexes         DuaIndex[]
  duaItems        DuaItem[]

  // Indexes
  @@index([status])
  @@index([displayOrder])
  @@index([isVisibleInApp])
  @@index([createdAt])
  @@index([updatedAt])
}

model DuaIndex {
  id              String      @id @default(cuid())
  bookId          String
  titleBn         String
  titleEn         String
  subtitleBn      String?
  subtitleEn      String?
  descriptionBn   String?     @db.Text
  descriptionEn   String?     @db.Text
  slug            String
  icon            String?
  displayOrder    Int         @default(0)
  status          DuaStatus   @default(draft)
  isVisibleInApp  Boolean     @default(true)
  version         Int         @default(1)
  publishedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  book            DuaBook     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  duaItems        DuaItem[]

  // Constraints
  @@unique([bookId, slug])

  // Indexes
  @@index([bookId])
  @@index([status])
  @@index([displayOrder])
  @@index([isVisibleInApp])
  @@index([createdAt])
  @@index([updatedAt])
}

model DuaCategory {
  id              String      @id @default(cuid())
  nameBn          String
  nameEn          String
  descriptionBn   String?     @db.Text
  descriptionEn   String?     @db.Text
  slug            String      @unique
  icon            String?
  color           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  duaItems        DuaItem[]

  // Indexes
  @@index([createdAt])
  @@index([updatedAt])
}

model DuaItem {
  id                  String      @id @default(cuid())
  bookId              String
  indexId             String
  categoryId          String
  titleBn             String
  titleEn             String
  shortDescriptionBn  String?     @db.Text
  shortDescriptionEn  String?     @db.Text
  arabicText          String?     @db.Text
  banglaMeaning       String?     @db.Text
  englishMeaning      String?     @db.Text
  transliterationBn   String?     @db.Text
  transliterationEn   String?     @db.Text
  referenceBn         String?     @db.Text
  referenceEn         String?     @db.Text
  benefitsBn          String?     @db.Text
  benefitsEn          String?     @db.Text
  notesBn             String?     @db.Text
  notesEn             String?     @db.Text
  repeatCount         Int         @default(1)
  tagsBn              String[]
  tagsEn              String[]
  searchKeywordsBn    String?     @db.Text
  searchKeywordsEn    String?     @db.Text
  slug                String
  displayOrder        Int         @default(0)
  status              DuaStatus   @default(draft)
  isVisibleInApp      Boolean     @default(true)
  version             Int         @default(1)
  publishedAt         DateTime?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  // Relations
  book                DuaBook     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  index               DuaIndex    @relation(fields: [indexId], references: [id], onDelete: Cascade)
  category            DuaCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([indexId, slug])

  // Indexes
  @@index([bookId])
  @@index([indexId])
  @@index([categoryId])
  @@index([status])
  @@index([displayOrder])
  @@index([isVisibleInApp])
  @@index([createdAt])
  @@index([updatedAt])
}
```

---

## 2. Structure & Relationships

1.  **DuaBook (Collection)**: The top-level folder/book (e.g. "Morning & Evening Dua" or "Quranic Duas").
2.  **DuaIndex (Section/Chapter)**: Child folder grouping related supplications under a specific book (e.g. "Family and Children" or "Steadfastness").
    *   Linked to `DuaBook` via `bookId`.
    *   Compound unique constraint: `[bookId, slug]`.
3.  **DuaCategory**: Categorized attribute group (e.g., "Forgiveness", "Family", "Travel").
    *   **Crucial Concept**: Category is **NOT** a hierarchy level in the folder structure. Rather, it is a metadata attribute associated with each `DuaItem`.
4.  **DuaItem (Supplication)**: The actual Dua node containing text and meaning.
    *   Must be linked to a parent `bookId`, parent `indexId`, and a required `categoryId`.
    *   Compound unique constraint: `[indexId, slug]`.

---

## 3. Bilingual Field Mapping

Every client UI page should support toggling between Bangla and English. Refer to the table below for rendering properties:

| Logical Field | Bangla Property | English Property | Type / Styling |
| :--- | :--- | :--- | :--- |
| **Book Name** | `nameBn` | `nameEn` | Text |
| **Book Subtitle** | `subtitleBn` | `subtitleEn` | Text |
| **Book Description** | `descriptionBn` | `descriptionEn` | Text / Paragraphs |
| **Index Title** | `titleBn` | `titleEn` | Text |
| **Index Subtitle** | `subtitleBn` | `subtitleEn` | Text |
| **Dua Title** | `titleBn` | `titleEn` | Text |
| **Arabic Text** | `arabicText` | `arabicText` | Large RTL Font (`font-serif`, size $\ge$ 20pt) |
| **Transliteration** | `transliterationBn` | `transliterationEn` | Italic Text |
| **Meaning / Translation** | `banglaMeaning` | `englishMeaning` | Standard Text |
| **Reference / Source** | `referenceBn` | `referenceEn` | Text |
| **Benefits** | `benefitsBn` | `benefitsEn` | Text |
| **Notes / Commentary** | `notesBn` | `notesEn` | Text |
| **Tags / Labels** | `tagsBn` (array) | `tagsEn` (array) | Chip badges |

---

## 4. How to Fetch data for Client Sync (API)

To sync the client app with Supabase PostgreSQL, query published and visible items only.

### Option A: Querying Categories
To populate category filters or standalone lists:
```typescript
const categories = await prisma.duaCategory.findMany({
  orderBy: { nameEn: "asc" }
});
```

### Option B: Eager-loading the Nested Content Tree (Prisma)
To fetch the entire library hierarchy in one query for offline usage or caching:
```typescript
const books = await prisma.duaBook.findMany({
  where: {
    status: "published",
    isVisibleInApp: true,
  },
  include: {
    indexes: {
      where: {
        status: "published",
        isVisibleInApp: true,
      },
      orderBy: { displayOrder: "asc" },
      include: {
        duaItems: {
          where: {
            status: "published",
            isVisibleInApp: true,
          },
          orderBy: { displayOrder: "asc" },
          include: {
            category: true, // Resolves required category details
          }
        }
      }
    }
  },
  orderBy: { displayOrder: "asc" }
});
```

---

## 5. Client Integration & UI Mapping Guidelines

When integrating this database structure into the existing mobile app UI:

### 1. Maintain Present Mobile UI & Layout Exactly
*   **No New UI Elements**: Do not add any new UI components, buttons, category filter bars, search controls, or tabs. Keep the visual design, screen hierarchy, and widgets exactly as they are currently implemented.
*   **Static to Dynamic Data Binding**: Replace the existing hardcoded strings and placeholder values in your current widgets directly with variables queried from the database.
*   **Variable Name Mapping**: If the database field names (e.g. `arabicText`, `banglaMeaning`, `referenceBn`) differ from your current local models, map them directly to the existing variable names (e.g. mapping `dua.arabicText` to `arabic_text` or `textArabic`) without changing the widgets themselves.

### 2. Version-Based Sync Check (Offline Synchronization)
Maintain offline access by caching variables locally. To sync updates from Supabase:
*   **Step 1**: Store the max `version` of items cached locally in SQLite/Hive/Preferences.
*   **Step 2**: Query the latest book/supplication versions from the server:
    ```typescript
    const versions = await prisma.duaBook.findMany({
      select: { slug: true, version: true }
    });
    ```
*   **Step 3**: If a book version on the server is higher than the cached version, fetch that book's updated indexes and duas and overwrite the local tables.

### 3. Local Relational Cache Structure
Map incoming JSON payloads directly to local database tables:
*   `dua_books` -> maps columns matching `DuaBook` (nameEn, nameBn, slug, etc.)
*   `dua_indexes` -> maps columns matching `DuaIndex` (titleEn, titleBn, slug, bookId, etc.)
*   `dua_categories` -> maps columns matching `DuaCategory` (nameEn, nameBn, slug, etc.)
*   `dua_items` -> maps columns matching `DuaItem` (titleEn, titleBn, arabicText, banglaMeaning, englishMeaning, referenceEn, etc.)
