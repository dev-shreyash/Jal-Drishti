-- CreateTable
CREATE TABLE `Village` (
    `village_id` INTEGER NOT NULL AUTO_INCREMENT,
    `village_name` VARCHAR(191) NOT NULL,
    `taluka` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `population` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`village_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `contact_number` VARCHAR(191) NULL,
    `village_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Operator` (
    `operator_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `village_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Operator_username_key`(`username`),
    PRIMARY KEY (`operator_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pump` (
    `pump_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pump_name` VARCHAR(191) NOT NULL,
    `model_number` VARCHAR(191) NULL,
    `installation_date` DATETIME(3) NULL,
    `last_maintained` DATETIME(3) NULL,
    `qr_code` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `flow_rate_lph` INTEGER NOT NULL,
    `is_smart_pump` BOOLEAN NOT NULL DEFAULT false,
    `village_id` INTEGER NOT NULL,

    UNIQUE INDEX `Pump_qr_code_key`(`qr_code`),
    PRIMARY KEY (`pump_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tank` (
    `tank_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tank_name` VARCHAR(191) NOT NULL,
    `capacity_liters` INTEGER NOT NULL,
    `material_type` VARCHAR(191) NULL,
    `last_cleaned_date` DATETIME(3) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `is_smart_tank` BOOLEAN NOT NULL DEFAULT false,
    `village_id` INTEGER NOT NULL,

    PRIMARY KEY (`tank_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyLog` (
    `log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `usage_liters` DOUBLE NOT NULL,
    `gps_lat` DOUBLE NOT NULL,
    `gps_lng` DOUBLE NOT NULL,
    `photo_url` VARCHAR(191) NULL,
    `chlorine_added` BOOLEAN NOT NULL DEFAULT false,
    `chlorine_ppm` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `operator_id` INTEGER NOT NULL,
    `pump_id` INTEGER NOT NULL,

    INDEX `DailyLog_start_time_idx`(`start_time`),
    INDEX `DailyLog_pump_id_start_time_idx`(`pump_id`, `start_time`),
    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SensorLog` (
    `sensor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reading_type` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `pump_id` INTEGER NULL,
    `tank_id` INTEGER NULL,

    PRIMARY KEY (`sensor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prediction` (
    `prediction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `prediction_date` DATETIME(3) NOT NULL,
    `predicted_usage` DOUBLE NOT NULL,
    `shortage_flag` BOOLEAN NOT NULL,
    `confidence_score` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pump_id` INTEGER NOT NULL,

    PRIMARY KEY (`prediction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resident` (
    `resident_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `village_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Resident_phone_key`(`phone`),
    PRIMARY KEY (`resident_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Complaint` (
    `complaint_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `photo_url` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolved_at` DATETIME(3) NULL,
    `resident_id` INTEGER NOT NULL,
    `pump_id` INTEGER NULL,

    PRIMARY KEY (`complaint_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `date_posted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `village_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AiModel` (
    `model_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trained_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `algorithm` VARCHAR(191) NOT NULL DEFAULT 'ARIMA',
    `model_weights` JSON NOT NULL,
    `village_id` INTEGER NOT NULL,

    PRIMARY KEY (`model_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChangeRequest` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `operator_id` INTEGER NOT NULL,
    `pump_id` INTEGER NULL,
    `req_pump_name` VARCHAR(191) NULL,
    `req_model_number` VARCHAR(191) NULL,
    `req_latitude` DOUBLE NULL,
    `req_longitude` DOUBLE NULL,
    `req_flow_rate` INTEGER NULL,
    `req_is_smart` BOOLEAN NULL,
    `reason` VARCHAR(191) NULL,
    `admin_remark` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolved_at` DATETIME(3) NULL,

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Operator` ADD CONSTRAINT `Operator_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pump` ADD CONSTRAINT `Pump_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tank` ADD CONSTRAINT `Tank_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyLog` ADD CONSTRAINT `DailyLog_operator_id_fkey` FOREIGN KEY (`operator_id`) REFERENCES `Operator`(`operator_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyLog` ADD CONSTRAINT `DailyLog_pump_id_fkey` FOREIGN KEY (`pump_id`) REFERENCES `Pump`(`pump_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SensorLog` ADD CONSTRAINT `SensorLog_pump_id_fkey` FOREIGN KEY (`pump_id`) REFERENCES `Pump`(`pump_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SensorLog` ADD CONSTRAINT `SensorLog_tank_id_fkey` FOREIGN KEY (`tank_id`) REFERENCES `Tank`(`tank_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prediction` ADD CONSTRAINT `Prediction_pump_id_fkey` FOREIGN KEY (`pump_id`) REFERENCES `Pump`(`pump_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resident` ADD CONSTRAINT `Resident_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_resident_id_fkey` FOREIGN KEY (`resident_id`) REFERENCES `Resident`(`resident_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_pump_id_fkey` FOREIGN KEY (`pump_id`) REFERENCES `Pump`(`pump_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AiModel` ADD CONSTRAINT `AiModel_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`village_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChangeRequest` ADD CONSTRAINT `ChangeRequest_operator_id_fkey` FOREIGN KEY (`operator_id`) REFERENCES `Operator`(`operator_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChangeRequest` ADD CONSTRAINT `ChangeRequest_pump_id_fkey` FOREIGN KEY (`pump_id`) REFERENCES `Pump`(`pump_id`) ON DELETE SET NULL ON UPDATE CASCADE;
