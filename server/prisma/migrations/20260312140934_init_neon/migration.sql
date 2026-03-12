-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateTable
CREATE TABLE "Village" (
    "village_id" SERIAL NOT NULL,
    "village_name" TEXT NOT NULL,
    "taluka" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "population" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("village_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email" TEXT,
    "contact_number" TEXT,
    "village_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "operator_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "village_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("operator_id")
);

-- CreateTable
CREATE TABLE "Pump" (
    "pump_id" SERIAL NOT NULL,
    "pump_name" TEXT NOT NULL,
    "model_number" TEXT,
    "installation_date" TIMESTAMP(3),
    "last_maintained" TIMESTAMP(3),
    "qr_code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "flow_rate_lph" INTEGER NOT NULL,
    "is_smart_pump" BOOLEAN NOT NULL DEFAULT false,
    "village_id" INTEGER NOT NULL,

    CONSTRAINT "Pump_pkey" PRIMARY KEY ("pump_id")
);

-- CreateTable
CREATE TABLE "Tank" (
    "tank_id" SERIAL NOT NULL,
    "tank_name" TEXT NOT NULL,
    "capacity_liters" INTEGER NOT NULL,
    "material_type" TEXT,
    "last_cleaned_date" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "is_smart_tank" BOOLEAN NOT NULL DEFAULT false,
    "village_id" INTEGER NOT NULL,

    CONSTRAINT "Tank_pkey" PRIMARY KEY ("tank_id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "log_id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "usage_liters" DOUBLE PRECISION NOT NULL,
    "gps_lat" DOUBLE PRECISION NOT NULL,
    "gps_lng" DOUBLE PRECISION NOT NULL,
    "photo_url" TEXT,
    "chlorine_added" BOOLEAN NOT NULL DEFAULT false,
    "chlorine_ppm" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operator_id" INTEGER NOT NULL,
    "pump_id" INTEGER NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "SensorLog" (
    "sensor_id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reading_type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "pump_id" INTEGER,
    "tank_id" INTEGER,

    CONSTRAINT "SensorLog_pkey" PRIMARY KEY ("sensor_id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "prediction_id" SERIAL NOT NULL,
    "prediction_date" TIMESTAMP(3) NOT NULL,
    "predicted_usage" DOUBLE PRECISION NOT NULL,
    "shortage_flag" BOOLEAN NOT NULL,
    "confidence_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pump_id" INTEGER NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("prediction_id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "resident_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "address" TEXT,
    "village_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("resident_id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "complaint_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo_url" TEXT,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "resident_id" INTEGER NOT NULL,
    "pump_id" INTEGER,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("complaint_id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "date_posted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "village_id" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiModel" (
    "model_id" SERIAL NOT NULL,
    "trained_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "algorithm" TEXT NOT NULL DEFAULT 'ARIMA',
    "model_weights" JSONB NOT NULL,
    "village_id" INTEGER NOT NULL,

    CONSTRAINT "AiModel_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "ChangeRequest" (
    "request_id" SERIAL NOT NULL,
    "request_type" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "operator_id" INTEGER NOT NULL,
    "pump_id" INTEGER,
    "req_pump_name" TEXT,
    "req_model_number" TEXT,
    "req_latitude" DOUBLE PRECISION,
    "req_longitude" DOUBLE PRECISION,
    "req_flow_rate" INTEGER,
    "req_is_smart" BOOLEAN,
    "reason" TEXT,
    "admin_remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "ChangeRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_username_key" ON "Operator"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Pump_qr_code_key" ON "Pump"("qr_code");

-- CreateIndex
CREATE INDEX "DailyLog_start_time_idx" ON "DailyLog"("start_time");

-- CreateIndex
CREATE INDEX "DailyLog_pump_id_start_time_idx" ON "DailyLog"("pump_id", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_phone_key" ON "Resident"("phone");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "Village"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "Village"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pump" ADD CONSTRAINT "Pump_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "Village"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tank" ADD CONSTRAINT "Tank_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "Village"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "Operator"("operator_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_pump_id_fkey" FOREIGN KEY ("pump_id") REFERENCES "Pump"("pump_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorLog" ADD CONSTRAINT "SensorLog_pump_id_fkey" FOREIGN KEY ("pump_id") REFERENCES "Pump"("pump_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorLog" ADD CONSTRAINT "SensorLog_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "Tank"("tank_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_pump_id_fkey" FOREIGN KEY ("pump_id") REFERENCES "Pump"("pump_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "Village"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "Resident"("resident_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_pump_id_fkey" FOREIGN KEY ("pump_id") REFERENCES "Pump"("pump_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "Village"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiModel" ADD CONSTRAINT "AiModel_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "Village"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "Operator"("operator_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_pump_id_fkey" FOREIGN KEY ("pump_id") REFERENCES "Pump"("pump_id") ON DELETE SET NULL ON UPDATE CASCADE;
