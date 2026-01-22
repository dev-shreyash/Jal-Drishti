/*
  Warnings:

  - You are about to drop the column `pump_id` on the `aimodel` table. All the data in the column will be lost.
  - Added the required column `village_id` to the `AiModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `aimodel` DROP FOREIGN KEY `AiModel_pump_id_fkey`;

-- AlterTable
ALTER TABLE `aimodel` DROP COLUMN `pump_id`,
    ADD COLUMN `village_id` INTEGER NOT NULL,
    MODIFY `algorithm` VARCHAR(191) NOT NULL DEFAULT 'ARIMA';

-- AddForeignKey
ALTER TABLE `AiModel` ADD CONSTRAINT `AiModel_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
