import { DuaBook, DuaIndex, DuaItem, DuaCategory } from "@prisma/client";

export interface DuaItemWithCategory extends DuaItem {
  category: DuaCategory;
  book?: DuaBook;
  index?: DuaIndex;
}

export interface DuaIndexWithItems extends DuaIndex {
  book?: DuaBook;
  duaItems: DuaItemWithCategory[];
  _count?: {
    duaItems: number;
  };
}

export interface DuaBookWithIndexes extends DuaBook {
  indexes: DuaIndexWithItems[];
  _count?: {
    indexes: number;
    duaItems: number;
  };
}
