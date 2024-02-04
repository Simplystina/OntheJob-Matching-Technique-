import * as faker from '@faker-js/faker';
import {Gender, Role, Experience} from "@prisma/client"
//  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
//         'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
//         'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'


const generateRandomSkills = (count:number) => {
  const skills = ['communication', 'learning', 'adaptation', 'teamwork', 'problem-solving', 'leadership'];
  const selectedSkills = []
    for (let index = 0; index < count; index++) {
      const take = skills[Math.floor(Math.random() * skills.length)]
      selectedSkills.push(take)
    }
  return selectedSkills
};

const generateRandomMentorshipPaths = (count: number) => {
  const mentorshipPaths = ['cybersecurity', 'software development', 'data science', 'networking'];
   const selectedmentorshipPaths = []
    for (let index = 0; index < count; index++) {
      const take = mentorshipPaths[Math.floor(Math.random() * mentorshipPaths.length)]
      selectedmentorshipPaths.push(take)
    }
  return selectedmentorshipPaths
};

    
  
   
    

const gender = [...Object.values(Gender)]
const experience = [...Object.values(Experience)]
const nigerianStates = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River'];
        
const generateRandomMentorData = () => {
  return {
    email: faker.faker.internet.email(),
    firstName: faker.faker.name.firstName(),
    lastName: faker.faker.name.lastName(),
    uid: faker.faker.datatype.uuid(),
    gender: gender[Math.floor(Math.random() * 2)],
    mentorshipPath: generateRandomMentorshipPaths(3),
    skills: generateRandomSkills(3),
    role: Role["MENTOR"],
    password:"password",
    stateOfResidence : nigerianStates[Math.floor(Math.random() * nigerianStates.length)]
  };
};

const generateRandomMenteeData = () => {
  return {
    email: faker.faker.internet.email(),
    firstName: faker.faker.name.firstName(),
    lastName: faker.faker.name.lastName(),
    uid: faker.faker.datatype.uuid(),
    role: Role["MENTEE"],
    gender: gender[Math.floor(Math.random() * 2)],
    learningSkills: generateRandomMentorshipPaths(3),
    skills: generateRandomSkills(2),
    experience: experience[Math.floor(Math.random() * 3)],
    password:"password",
     stateOfResidence : nigerianStates[Math.floor(Math.random() * nigerianStates.length)]
  };
};

const generateDummyMentors = (count:number) => {
  const dummyMentors = Array.from({ length: count }, () => generateRandomMentorData());
  return dummyMentors;
};

const generateDummyMentees = (count:number) => {
  const dummyMentees = Array.from({ length: count }, () => generateRandomMenteeData());
  return dummyMentees;
};

export const dummyMentors = generateDummyMentors(10);
export const dummyMentees = generateDummyMentees(70)
