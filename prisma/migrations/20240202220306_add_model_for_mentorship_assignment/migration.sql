/*
  Warnings:

  - You are about to drop the column `experience` on the `Mentor` table. All the data in the column will be lost.
  - Added the required column `experience` to the `Mentee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssignmemtStatus" AS ENUM ('PENDING', 'INITIAL_ALLOCATION', 'MENTOR_ACCEPTED', 'MENTOR_REJECTED');

-- AlterTable
ALTER TABLE "Mentee" ADD COLUMN     "experience" "Experience" NOT NULL,
ADD COLUMN     "status" "AssignmemtStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "experience",
ADD COLUMN     "communicationURl" TEXT,
ADD COLUMN     "completedMatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "countOfAssignedMentees" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "modeOfCommunication" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uid" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MentorshipAssignment" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "dateOfAssignment" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfRejection" TIMESTAMP(3),
    "dateOfAcceptance" TIMESTAMP(3),
    "status" "AssignmemtStatus" NOT NULL DEFAULT 'INITIAL_ALLOCATION',
    "completeMentorship" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MentorshipAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MentorshipAssignment" ADD CONSTRAINT "MentorshipAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipAssignment" ADD CONSTRAINT "MentorshipAssignment_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "Mentee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
