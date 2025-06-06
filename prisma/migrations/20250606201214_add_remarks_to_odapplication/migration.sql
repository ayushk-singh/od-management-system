/*
  Warnings:

  - You are about to drop the column `Remark` on the `ODApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ODApplication" DROP COLUMN "Remark",
ADD COLUMN     "remark" TEXT;
