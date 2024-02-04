import { Gender, Prisma, Role, User, UserStatus, Experience } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';
import { convertToSmallLetter } from '../utils/services';

/**
 * Create a user with email and password
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (
  uid: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string,
  role: Role,
  gender: Gender,
  status: UserStatus = UserStatus.PENDING
): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken. Please login');
  }

  return prisma.user.create({
    data: {
      uid,
      email,
      firstName,
      lastName,
      phone,
      password: await encryptPassword(password),
      status,
      gender,
      role
    }
  });
};

/**
 * Create a user with social auth
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createSocialUser = async (
  email: string,
  uid: string,
  firstName: string,
  lastName: string,
  photo: string,
  password: string,
  gender: Gender,
  role: Role = Role.MENTEE,
  status: UserStatus = UserStatus.ACTIVE
): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken. Please login');
  }

  return prisma.user.create({
    data: {
      email,
      uid,
      gender,
      firstName,
      lastName,
      photo,
      password: await encryptPassword(password),
      status,
      role
    }
  });
};

/**
 * Create a Mentor with mind the gap
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createMentor = async (
  email: string,
  uid: string,
  firstName: string,
  lastName: string,
  password: string,
  gender: Gender,
  mentorshipPath: string[],
  skills: string[],
  role: Role = Role.MENTOR,
  status: UserStatus = UserStatus.ACTIVE
): Promise<User> => {
  try {
    if (await getUserByEmail(email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists. Please login');
    }

    skills = convertToSmallLetter(skills);
    mentorshipPath = convertToSmallLetter(mentorshipPath);
    const userAndMentor = await prisma.$transaction(async (tx) => {
      // Create a new user
      const user = await tx.user.create({
        data: {
          email,
          uid,
          gender,
          firstName,
          lastName,
          password: await encryptPassword(password),
          status,
          role
        }
      });

      // Create new mentorship path if they don't exist
      const mentorshipPathPromises = mentorshipPath.map((path) =>
        tx.mentorshipPath.upsert({
          where: { name: path },
          update: {},
          create: { name: path }
        })
      );
      const createdMentorship = await Promise.all(mentorshipPathPromises);

      // Create new skills if they don't exist
      const skillPromises = skills.map((skillName) =>
        tx.skills.upsert({
          where: { skill: skillName },
          update: {},
          create: { skill: skillName }
        })
      );
      const createdSkills = await Promise.all(skillPromises);

      // Create a new mentor associated with the user
      await tx.mentor.create({
        data: {
          mentorshipPath: {
            connect: createdMentorship.map((path) => ({ id: path.id }))
          },
          skills: {
            connect: createdSkills.map((skill) => ({ id: skill.id }))
          },
          userId: user.id
        },
        include: { user: true }
      });
      return user;
    });
    return userAndMentor;
  } catch (error) {
    console.error('Error creating User and Mentor:', error);
    throw error;
  }
};

/**
 * Create a Mentee with mind the gap
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createMentee = async (
  email: string,
  uid: string,
  firstName: string,
  lastName: string,
  password: string,
  gender: Gender,
  learningPaths: string[],
  skills: string[],
  experienceLevel: Experience,
  role: Role = Role.MENTEE,
  status: UserStatus = UserStatus.ACTIVE
): Promise<User> => {
  try {
    if (await getUserByEmail(email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    skills = convertToSmallLetter(skills);
    learningPaths = convertToSmallLetter(learningPaths);

    const userAndMentee = await prisma.$transaction(async (tx) => {
      // Create a new user
      const user = await tx.user.create({
        data: {
          email,
          uid,
          gender,
          firstName,
          lastName,
          password: await encryptPassword(password),
          status,
          role
        }
      });

      // Fetch or create the mentorship path
      const learningPathPromises = learningPaths.map((path) =>
        tx.mentorshipPath.upsert({
          where: { name: path },
          update: {},
          create: { name: path }
        })
      );
      const createdLearningPath = await Promise.all(learningPathPromises);

      // Create new skills if they don't exist
      const skillPromises = skills.map((skillName) =>
        tx.skills.upsert({
          where: { skill: skillName },
          update: {},
          create: { skill: skillName }
        })
      );
      const createdSkills = await Promise.all(skillPromises);

      // Create a new mentee associated with the user
      await tx.mentee.create({
        data: {
          areaOfInterest: {
            connect: createdLearningPath.map((path) => ({ id: path.id }))
          },
          skills: {
            //connect: skills.map((skillId) => ({ id: skillId })),
            connect: createdSkills.map((skill) => ({ id: skill.id }))
          },
         userId: user.id, 
          experience: experienceLevel
        },
      });
      return user;
    });
    return userAndMentee;
  } catch (error) {
    console.error('Error creating User and Mentee:', error);
    throw error;
  }
};

/**
 * Create a Business with mind the gap
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createBusiness = async (
  email: string,
  uid: string,
  firstName: string,
  lastName: string,
  password: string,
  gender: Gender,
  hiringSector: string[],
  tracks: string[],
  role: Role = Role.BUSINESS,
  status: UserStatus = UserStatus.ACTIVE
): Promise<User> => {
  try {
    if (await getUserByEmail(email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    hiringSector = convertToSmallLetter(hiringSector);
    tracks = convertToSmallLetter(tracks);

    const userAndBusiness = await prisma.$transaction(async (tx) => {
      // Create a new user
      const user = await tx.user.create({
        data: {
          email,
          uid,
          gender,
          firstName,
          lastName,
          password: await encryptPassword(password),
          status,
          role
        }
      });

      // Create new sectors if they don't exist
      const hiringSectorPromises = hiringSector.map((sector) =>
        tx.mentorshipPath.upsert({
          where: { name: sector },
          update: {},
          create: { name: sector }
        })
      );
      const createdHiringSector = await Promise.all(hiringSectorPromises);

      // Create new tracks if they don't exist
      const tracksPromises = tracks.map((sector) =>
        tx.internTracks.upsert({
          where: { name: sector },
          update: {},
          create: { name: sector }
        })
      );
      const createdTracksPromises = await Promise.all(tracksPromises);

      //Create a new business associated with the user
      await tx.business.create({
        data: {
          hiringSector: {
            connect: createdHiringSector.map((sector) => ({ id: sector.id }))
          },
          tracks: {
            connect: createdTracksPromises.map((track) => ({ id: track.id }))
          },
          userId: user.id
        }
      });

      return user;
    });
    return userAndBusiness;
  } catch (error) {
    console.error('Error creating User and Business:', error);
    throw error;
  }
};

/**
 *
 */
const createAdmin = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  gender: Gender,
  role: Role = Role.ADMIN,
  status: UserStatus = UserStatus.ACTIVE
): Promise<User> => {
  try {
    if (await getUserByEmail(email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const user = await prisma.user.create({
      data: {
        email,
        gender,
        firstName,
        lastName,
        password: await encryptPassword(password),
        status,
        role
      }
    });
    return user;
  } catch (error) {
    console.error('Error creating User and Business:', error);
    throw error;
  }
};

/**
 * Get all Mentors
 */
const getMentors = async (): Promise<User[]> => {
  const mentors = await prisma.user.findMany({
    where: { role: 'MENTOR' },
    include: {
      mentor: true
    }
  });
  return mentors;
};

/**
 * Get all Mentees
 */
const getMentees = async (): Promise<User[]> => {
  const mentees = await prisma.user.findMany({
    where: { role: 'MENTEE' },
    include: {
      mentee: true
    }
  });
  return mentees;
};

/**
 * Get all Business
 */
const getBusiness = async (): Promise<User[]> => {
  const mentors = await prisma.user.findMany({
    where: { role: 'BUSINESS' },
    include: {
      mentor: true
    }
  });
  return mentors;
};

/**
 * Query for users
 * @param {object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'email',
    'firstName',
    'lastName',
    'phone',
    'photo',
    'role',
    'gender',
    'status',
    'homeAddress',
    'stateOfResidence',
    'lgaOfResidence',
    'dateOfBirth'
  ] as Key[]
): Promise<Pick<User, Key>[]> => {
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const users = await prisma.user.findMany({
    where: filter ?? { role: 'MENTEE' },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),

    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return users as Pick<User, Key>[];
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
  id: string,
  keys: Key[] = [
    'id',
    'email',
    'firstName',
    'lastName',
    'role',
    'photo',
    'gender',
    'status',
    'homeAddress',
    'stateOfResidence',
    'lgaOfResidence',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = [
    'id',
    'email',
    'firstName',
    'lastName',
    'password',
    'role',
    'gender',
    'status',
    'homeAddress',
    'stateOfResidence',
    'lgaOfResidence',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async <Key extends keyof User>(
  userId: string,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = [
    'id',
    'firstName',
    'lastName',
    'password',
    'phone',
    'role',
    'gender',
    'status',
    'homeAddress',
    'stateOfResidence',
    'lgaOfResidence'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  const user = await getUserById(userId, ['id', 'email', 'firstName', 'lastName']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // if (updateBody.email && (await getUserByEmail(updateBody.email as string))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<User, Key> | null;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  //Todo: Allow Admin to delete a user even when they are logged In or turn isDeleted: true
  await prisma.user.delete({ where: { id: user.id } });
  return user;
};

export default {
  createUser,
  createSocialUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  createMentor,
  createMentee,
  createBusiness,
  createAdmin,
  getMentees,
  getMentors,
  getBusiness
};
