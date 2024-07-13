/*
  Warnings:

  - You are about to drop the column `contact_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `contactId` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_contact_id_fkey`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `contact_id`,
    DROP COLUMN `postal_code`,
    ADD COLUMN `contactId` INTEGER NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(10) NOT NULL;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
