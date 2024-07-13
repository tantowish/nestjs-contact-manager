-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_contactId_fkey`;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
