import { Role } from '@prisma/client';

const allRoles = {
  [Role.MENTEE]: [], //add mentee privileges here
  [Role.MENTOR]: ['matchUsers','request'], //add mentor privileges here
  [Role.BUSINESS]: [], //add business privileges here
  [Role.ADMIN]: ['getUsers','matchUsers'], //add admin privileges here
  [Role.SUPER]: ['getUsers', 'manageUsers']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
