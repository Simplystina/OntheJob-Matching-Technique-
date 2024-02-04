export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

type UserWithMentee = {
id: string;
name: string;
// Other fields...
mentee: Mentee;
};

type UserWithMentor = {
id: string;
name: string;
// Other fields...
mentor: Mentor;
};

export type MatchedUserstype = {
  userMentee: UserWithMentee,
  userMentor: UserWithMentor,
  commonSkills : string[]
}

export type AssignmentType = {
  id: string;
  mentorId: string;
  menteeId: string;
  dateOfAssignment: Date;
  dateOfRejection: Date | null;
  dateOfAcceptance: Date | null;
  status: AssignmemtStatus;
  completeMentorship: boolean;
  mentee: {
    id: string;
    mentorId: string | null;
    interningAtId: string | null;
    userId: string;
    experience: Experience;
  };
}

