/*
  Warnings:

  - You are about to alter the column `createdAt` on the `Tasks` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `Tasks` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Tasks" ("createdAt", "description", "id", "isClosed", "name", "updatedAt") SELECT "createdAt", "description", "id", "isClosed", "name", "updatedAt" FROM "Tasks";
DROP TABLE "Tasks";
ALTER TABLE "new_Tasks" RENAME TO "Tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
