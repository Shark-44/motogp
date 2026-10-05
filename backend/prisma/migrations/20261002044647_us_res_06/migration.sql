/*
  Warnings:

  - Made the column `fimNumber` on table `rider` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `contratId` to the `SessionResults` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Rider_fimNumber_key` ON `rider`;

-- AlterTable
ALTER TABLE `rider` MODIFY `fimNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sessionresults` ADD COLUMN `contratId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `RiderStandings` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `piloteId` VARCHAR(191) NOT NULL,
    `pointsCumules` INTEGER NOT NULL,
    `positionGenerale` INTEGER NOT NULL,

    UNIQUE INDEX `RiderStandings_eventId_piloteId_key`(`eventId`, `piloteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamStandings` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `equipeId` VARCHAR(191) NOT NULL,
    `pointsCumules` INTEGER NOT NULL,
    `positionGenerale` INTEGER NOT NULL,

    UNIQUE INDEX `TeamStandings_eventId_equipeId_key`(`eventId`, `equipeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SessionResults` ADD CONSTRAINT `SessionResults_contratId_fkey` FOREIGN KEY (`contratId`) REFERENCES `Contract`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RiderStandings` ADD CONSTRAINT `RiderStandings_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `RaceEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RiderStandings` ADD CONSTRAINT `RiderStandings_piloteId_fkey` FOREIGN KEY (`piloteId`) REFERENCES `Rider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamStandings` ADD CONSTRAINT `TeamStandings_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `RaceEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamStandings` ADD CONSTRAINT `TeamStandings_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
