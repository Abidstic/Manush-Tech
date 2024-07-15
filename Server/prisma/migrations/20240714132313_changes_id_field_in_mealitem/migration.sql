/*
  Warnings:

  - The primary key for the `meal_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `meal_items` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_meal_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mealId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "meal_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "meal_items_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_meal_items" ("itemId", "mealId") SELECT "itemId", "mealId" FROM "meal_items";
DROP TABLE "meal_items";
ALTER TABLE "new_meal_items" RENAME TO "meal_items";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
