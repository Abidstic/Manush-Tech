/*
  Warnings:

  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `items` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `items` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `userId` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `itemName` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderDate` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "meals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mealName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "meal_items" (
    "mealId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    PRIMARY KEY ("mealId", "itemId"),
    CONSTRAINT "meal_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "meal_items_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mealId" INTEGER NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    CONSTRAINT "meal_schedules_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL
);
INSERT INTO "new_items" ("category", "id") SELECT "category", "id" FROM "items";
DROP TABLE "items";
ALTER TABLE "new_items" RENAME TO "items";
CREATE TABLE "new_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "orderDate" DATETIME NOT NULL,
    CONSTRAINT "orders_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "meal_schedules" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("id", "userId") SELECT "id", "userId" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("email", "id", "isBanned", "name", "password") SELECT "email", "id", "isBanned", "name", "password" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "roles_roleName_key" ON "roles"("roleName");
