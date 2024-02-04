-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'DISABLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MENTEE', 'MENTOR', 'BUSINESS', 'ADMIN', 'SUPER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL', 'OTP');

-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "TimePeriod" AS ENUM ('AM', 'PM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT DEFAULT '',
    "uid" TEXT,
    "password" TEXT,
    "gender" "Gender" NOT NULL,
    "homeAddress" TEXT,
    "stateOfResidence" TEXT,
    "lgaOfResidence" TEXT,
    "username" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MENTEE',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "photo" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "experience" "Experience" NOT NULL DEFAULT 'ADVANCED',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentee" (
    "id" TEXT NOT NULL,
    "experience" "Experience" NOT NULL DEFAULT 'BEGINNER',
    "mentorId" TEXT,
    "interningAtId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Mentee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipPath" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternTracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternTracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicTags" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mentorId" TEXT NOT NULL,

    CONSTRAINT "TopicTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferredHours" (
    "id" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "time" TEXT NOT NULL,
    "period" "TimePeriod" NOT NULL,

    CONSTRAINT "PreferredHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "blacklisted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MentorToMentorshipPath" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MentorToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MenteeToMentorshipPath" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MenteeToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BusinessToMentorshipPath" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BusinessToInternTracks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_userId_key" ON "Mentor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Mentee_userId_key" ON "Mentee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipPath_name_key" ON "MentorshipPath"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_skill_key" ON "Skills"("skill");

-- CreateIndex
CREATE UNIQUE INDEX "InternTracks_name_key" ON "InternTracks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TopicTags_tag_key" ON "TopicTags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "_MentorToMentorshipPath_AB_unique" ON "_MentorToMentorshipPath"("A", "B");

-- CreateIndex
CREATE INDEX "_MentorToMentorshipPath_B_index" ON "_MentorToMentorshipPath"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MentorToSkills_AB_unique" ON "_MentorToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_MentorToSkills_B_index" ON "_MentorToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenteeToMentorshipPath_AB_unique" ON "_MenteeToMentorshipPath"("A", "B");

-- CreateIndex
CREATE INDEX "_MenteeToMentorshipPath_B_index" ON "_MenteeToMentorshipPath"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenteeToSkills_AB_unique" ON "_MenteeToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_MenteeToSkills_B_index" ON "_MenteeToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessToMentorshipPath_AB_unique" ON "_BusinessToMentorshipPath"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessToMentorshipPath_B_index" ON "_BusinessToMentorshipPath"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessToInternTracks_AB_unique" ON "_BusinessToInternTracks"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessToInternTracks_B_index" ON "_BusinessToInternTracks"("B");

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentee" ADD CONSTRAINT "Mentee_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentee" ADD CONSTRAINT "Mentee_interningAtId_fkey" FOREIGN KEY ("interningAtId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentee" ADD CONSTRAINT "Mentee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicTags" ADD CONSTRAINT "TopicTags_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorToMentorshipPath" ADD CONSTRAINT "_MentorToMentorshipPath_A_fkey" FOREIGN KEY ("A") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorToMentorshipPath" ADD CONSTRAINT "_MentorToMentorshipPath_B_fkey" FOREIGN KEY ("B") REFERENCES "MentorshipPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorToSkills" ADD CONSTRAINT "_MentorToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorToSkills" ADD CONSTRAINT "_MentorToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenteeToMentorshipPath" ADD CONSTRAINT "_MenteeToMentorshipPath_A_fkey" FOREIGN KEY ("A") REFERENCES "Mentee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenteeToMentorshipPath" ADD CONSTRAINT "_MenteeToMentorshipPath_B_fkey" FOREIGN KEY ("B") REFERENCES "MentorshipPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenteeToSkills" ADD CONSTRAINT "_MenteeToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Mentee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenteeToSkills" ADD CONSTRAINT "_MenteeToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToMentorshipPath" ADD CONSTRAINT "_BusinessToMentorshipPath_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToMentorshipPath" ADD CONSTRAINT "_BusinessToMentorshipPath_B_fkey" FOREIGN KEY ("B") REFERENCES "MentorshipPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToInternTracks" ADD CONSTRAINT "_BusinessToInternTracks_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToInternTracks" ADD CONSTRAINT "_BusinessToInternTracks_B_fkey" FOREIGN KEY ("B") REFERENCES "InternTracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
