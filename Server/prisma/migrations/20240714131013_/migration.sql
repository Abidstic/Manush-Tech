/*
  Warnings:

  - A unique constraint covering the columns `[mealName]` on the table `meals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "meals_mealName_key" ON "meals"("mealName");
