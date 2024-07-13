/*
  Warnings:

  - You are about to drop the column `username` on the `addresses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_username_fkey`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `username`;
