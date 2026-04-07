/*
  Warnings:

  - The `questions` column on the `PatientProgress` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `answer` column on the `PatientProgress` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PatientProgress" DROP COLUMN "questions",
ADD COLUMN     "questions" JSONB,
DROP COLUMN "answer",
ADD COLUMN     "answer" JSONB;
