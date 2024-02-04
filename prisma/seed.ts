import { PrismaClient, Prisma, UserStatus } from '@prisma/client';
import { encryptPassword } from '../src/utils/encryption';
import {
  dummyMentees, dummyMentors
} from '../src/utils/data';
const prisma = new PrismaClient();

const mentorData = [
 
...dummyMentors
];

const menteeData = [
 
...dummyMentees
];

console.log(mentorData,"userData")

async function seedMentor() {
  for (const u of mentorData){
     const userAndMentor = await prisma.$transaction(async (tx) => {
       // Create a new user
       
          let hashPassword = await encryptPassword(u.password || 'default');
          u.password = hashPassword;

            const user = await tx.user.create({
              data: {
                email: u.email,
                uid: u.uid,
                gender: u.gender,
                firstName: u.firstName,
                lastName: u.lastName,
                password: hashPassword,
                status : "ACTIVE",
                role: u.role,
                stateOfResidence: u.stateOfResidence
              }
            });


            // Fetch or create the mentorship path
            const mentorshipPathPromises = u.mentorshipPath.map((path) =>
              tx.mentorshipPath.upsert({
                where: { name: path},
                update: {},
                create: { name: path },
            })
            )
            const createdLearningPath = await Promise.all(mentorshipPathPromises)
            
            // Create new skills if they don't exist
            const skillPromises = u.skills.map((skillName) =>
                tx.skills.upsert({
                  where: { skill: skillName },
                  update: {},
                  create: { skill: skillName },
                })
            );
            const createdSkills = await Promise.all(skillPromises)
            
            // Create a new mentor associated with the user
          await tx.mentor.create({
            data: {
              mentorshipPath: {
                connect : createdLearningPath.map((path)=>({id:path.id}))
              },
                skills: {
                  //connect: skills.map((skillId) => ({ id: skillId })),
                  connect: createdSkills.map((skill)=>({id: skill.id}))
                },
              userId: user.id, 
                
              },
      });

          console.log('User and Mentor created successfully.');
            
          
    });
   }
}

async function seedMentee() {
   for (const u of menteeData){
     const userAndMentee = await prisma.$transaction(async (tx) => {
       // Create a new user
       
          let hashPassword = await encryptPassword(u.password || 'default');
          u.password = hashPassword;

            const user = await tx.user.create({
              data: {
                email: u.email,
                uid: u.uid,
                gender: u.gender,
                firstName: u.firstName,
                lastName: u.lastName,
                password: hashPassword,
                status : "ACTIVE",
                role: u.role,
                stateOfResidence: u.stateOfResidence
              }
            });


            // Fetch or create the mentorship path
            const mentorshipPathPromises = u.learningSkills.map((path) =>
              tx.mentorshipPath.upsert({
                where: { name: path},
                update: {},
                create: { name: path },
            })
            )
            const createdLearningPath = await Promise.all(mentorshipPathPromises)
            
            // Create new skills if they don't exist
            const skillPromises = u.skills.map((skillName) =>
                tx.skills.upsert({
                  where: { skill: skillName },
                  update: {},
                  create: { skill: skillName },
                })
            );
            const createdSkills = await Promise.all(skillPromises)
            
            // Create a new mentor associated with the user
        await tx.mentee.create({
          data: {
            areaOfInterest: {
              connect : createdLearningPath.map((path)=>({id:path.id}))
            },
              skills: {
                //connect: skills.map((skillId) => ({ id: skillId })),
                connect: createdSkills.map((skill)=>({id: skill.id}))
              },
            userId: user.id, 
              experience : u.experience
            },
      });

          console.log('User and Mentee created successfully.');
            
          
    });
   }
}
// async function main() {
//   console.log(`Start seeding ...`);
//   console.log(JSON.stringify(dummyMentors, null, 2));
//   console.log(JSON.stringify(dummyMentees, null, 2));
//   for (const u of userData) {
//     let hashPassword = await encryptPassword(u.password || 'default');
//     u.password = hashPassword;

//     const user = await prisma.user.create({
//       data: u
//     });
//     console.log(`Created user with id: ${user.id}`);
//   }
//   console.log(`Seeding finished.`);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

async function seed() {
  try {
    await seedMentee()
    await seedMentor()
    await prisma.$disconnect();
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed()