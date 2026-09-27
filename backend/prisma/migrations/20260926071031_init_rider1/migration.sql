-- CreateTable
CREATE TABLE `Circuit` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `pays` VARCHAR(191) NOT NULL,
    `longueurKm` DOUBLE NOT NULL,
    `nombreVirages` INTEGER NOT NULL,
    `photo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rider` (
    `id` VARCHAR(191) NOT NULL,
    `fimNumber` VARCHAR(191) NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `pays` VARCHAR(191) NOT NULL,
    `dateAnniversaire` DATETIME(3) NOT NULL,
    `photo` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rider_fimNumber_key`(`fimNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `pays` VARCHAR(191) NOT NULL,
    `constructeur` VARCHAR(191) NOT NULL,
    `estOfficielle` BOOLEAN NOT NULL DEFAULT false,
    `logo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contract` (
    `id` VARCHAR(191) NOT NULL,
    `saison` INTEGER NOT NULL,
    `role` ENUM('officiel', 'remplacant', 'wildcard') NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NULL,
    `piloteId` VARCHAR(191) NOT NULL,
    `equipeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RaceEvent` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `saison` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `statut` ENUM('PLANIFIE', 'TERMINE', 'ANNULE') NOT NULL,
    `circuitId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SessionResults` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `typeSession` ENUM('SPRINT', 'RACE') NOT NULL,
    `statut` ENUM('TERMINE', 'ABANDON', 'NON_PARTANT') NOT NULL,
    `position` INTEGER NULL,
    `piloteId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SessionResults_eventId_typeSession_piloteId_key`(`eventId`, `typeSession`, `piloteId`),
    UNIQUE INDEX `SessionResults_eventId_typeSession_position_key`(`eventId`, `typeSession`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_piloteId_fkey` FOREIGN KEY (`piloteId`) REFERENCES `Rider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RaceEvent` ADD CONSTRAINT `RaceEvent_circuitId_fkey` FOREIGN KEY (`circuitId`) REFERENCES `Circuit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SessionResults` ADD CONSTRAINT `SessionResults_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `RaceEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SessionResults` ADD CONSTRAINT `SessionResults_piloteId_fkey` FOREIGN KEY (`piloteId`) REFERENCES `Rider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
