import { error } from "console"
import prisma from "../client"
import ApiError from "../utils/ApiError"
import httpStatus from 'http-status';
import { AssignmemtStatus, Experience, Mentee, Mentor, Prisma, PrismaClient, User, MentorshipAssignment } from "@prisma/client";
import { MatchedUserstype,AssignmentType } from "../types/response";
import { matchByFirst , matchByHighestSkill} from "../utils/mentorMenteeMatcher";

//system matches people who have completed their profiles
const menteeMentorAssignment = async() => {
    const assignment = await prisma.$transaction(async (tx) => {
        
       
        //get Users from the system who has completed their profile state of residence and experience level and have not been matched
        const availableMentees = await tx.user.findMany({
            where: {
                role: "MENTEE",
                NOT: {
                    stateOfResidence: null,
                }
            },
            include: {
                mentee: {
                    where: {
                        mentorId: null,
                       
                    },
                    include: {
                        areaOfInterest: true,
                        MentorshipAssignment: true
                    },
                    
                },
              
            }
        })
        
        //Get the paths of available mentee
        const availableMentors = await tx.user.findMany({
                where: {
                    role: "MENTOR",
                    NOT: {
                        stateOfResidence: null,
                        
                        },
                    },
                    include: {
                        mentor: {
                            where: {
                                completedMatch: false
                            },
                            include: {
                                mentorshipPath: true,
                                mentee: true,
                                MentorshipAssignment: {
                                    where: {
                                        status: 'MENTOR_REJECTED'
                                    }
                                }
                            },
                        }
                   },
                    
        })
      const matchedUsers: MatchedUserstype[] = await matchByHighestSkill(availableMentees, availableMentors)
        
        const filterMatchedUsers =  matchedUsers.map((user) => {
            return {
                menteeId: user.userMentee.mentee.id,
                 mentorId: user.userMentor.mentor.id,
                status : AssignmemtStatus["INITIAL_ALLOCATION"]
            }
        })
     
        
        const createAss = await tx.mentorshipAssignment.createMany(
            {
                data: filterMatchedUsers
            }
            
        )
       return createAss
        
    })
    return assignment
}

/**
 * Unmatch every mentee that has not been accepted by their mentor after 3 days of initial allocation and remove from mentorship table
 */
const UnmatchMentees = async () => {
    
    let twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 4);

  //Delete every mentee in the mentorship table that have been assigned 4 days ago but have not been accepted
  await prisma.mentorshipAssignment.deleteMany({
        where: {
            status: 'INITIAL_ALLOCATION',
            dateOfAssignment: {
                lte: twoDaysAgo
            }
        }
    })
   
}

/**
 * 
 * @param menteeId 
 * @param id 
 * @returns 
 */
const mentorAcceptMentee = async (
    menteeId: string,
    user: any
) => {
    try {
        const acceptRequest = prisma.$transaction(async (tx) => {
       
            let id = user.id
                //Get mentor
                const getUser = await tx.user.findUnique({
                    where: {
                        id: id
                    },
                    include: {
                        mentor: true
                    }
                });
                if (!getUser) {
                    // Case where the mentor is not found
                    throw new ApiError(httpStatus.NOT_FOUND, 'Mentor not found');
                }
                if (getUser.mentor?.completedMatch) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'You have reached your limit of assigned Mentees');
                }

               //Get Mentee 
                const getMentee = await tx.mentee.findFirst(
                    {
                    where:
                        {
                            id: menteeId,
                        }
                    }
                )
            
                if (getMentee?.mentorId) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'This Mentee has already been accepted');
                }

             //get the assignment of mentee to this mentor
                const assignmentStatus = await tx.mentorshipAssignment.findFirst({
                    where: {
                        menteeId: menteeId,
                        mentorId: getUser?.mentor?.id,
                        status: 'INITIAL_ALLOCATION'
                    }
                })
               
              
               if (!assignmentStatus) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'This Mentee assignment to you does not exist');
               }
            

            //update the assignment status
            await tx.mentorshipAssignment.update({
                where: {
                    id: assignmentStatus?.id,
                    menteeId: menteeId,
                    mentorId: getUser?.mentor?.id
                },
                data: {
                    status: "MENTOR_ACCEPTED",
                    dateOfAcceptance: new Date()
                }
            })

            //update the mentee's mentor
            await tx.mentee.update({
                    where: { id: menteeId },
                    data:{mentorId: getUser?.mentor?.id}
                })
                
            //update the count of people assigned to a mentor
            if (getUser.mentor) {
                    if (getUser.mentor?.countOfAssignedMentees === 4) {
                    await tx.mentor.update({
                        where: { id: getUser.mentor.id},
                        data: {
                            completedMatch: true,
                            countOfAssignedMentees: getUser.mentor.countOfAssignedMentees + 1
                        }
                    });
                } else {
                    await tx.mentor.update({
                        where: { id: getUser.mentor.id},
                        data: {
                            countOfAssignedMentees: getUser?.mentor?.countOfAssignedMentees  + 1
                        }
                    });
                 
                }
                
            }
               
            
            return getUser
        });
    return acceptRequest
    } catch (error) {
         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while trying to accept mentee')
    }
}
/**
 * 
 * @param menteeId 
 * @param id 
 * @returns 
 */
const mentorRejectMentee = async (
    menteeId: string,
    user:any
    
) => {
    try {
        let id = user.id
       const rejectMentee = prisma.$transaction(async (tx) => {

           //Get mentor
            const getUser = await tx.user.findUnique({
                where: {
                    id: id
                },
                include: {
                    mentor: true
                }
            });
            if (!getUser) {
                // Handle the case where the mentor is not found
                throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
            }
            //check if mentor has reached the limit of assigned mentees
            if (getUser?.mentor?.completedMatch) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'You have reached your limit of assigned Mentees');
            }

           //check if mentee has been accpeted before now
                const getmentee = await tx.mentee.findUnique({
                    where:{id:menteeId, mentorId: getUser?.mentor?.id}
                })
                if (getmentee) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'This mentee has already been accepted and cannot be rejected');
                }
              
           //Get assignment status of mentee to this mentor
          const getAss = await tx.mentorshipAssignment.findFirst({
               where: {
                   menteeId: menteeId,
                  mentorId: getUser?.mentor?.id,
                   status: "INITIAL_ALLOCATION"
               },
           })
           if (!getAss) {
               throw new ApiError(httpStatus.NOT_FOUND, 'Assigment does not exist');
           }

            
          //update Mentorship Assignment status
           await tx.mentorshipAssignment.update({
               where: {
                   id: getAss.id,
                   menteeId: menteeId,
                   mentorId: getUser.mentor?.id
               },
               data: {
                   status: 'MENTOR_REJECTED',
                   dateOfRejection: new Date()
               }
           })
            
           return
    })
    return rejectMentee
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while trying to accept mentee')
    }
}

/**
 * 
 * @param status 
 * @param experience 
 * @param user 
 * @returns AssignmentType[]
 */
const getAllRequests = async (
    status: AssignmemtStatus,
    experience: Experience,
     user: any,
) => {
    let id = user.id

    const mentorshipAssignments : AssignmentType[] = await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            mentor: {
                include: {
                        MentorshipAssignment: {
                            where: {
                                    status: status,   
                            },
                        include: {
                            mentee: true
                        } 
                    }
                },
            },
        },
        })
        .then((user) => {
            
            const assignments = user?.mentor?.MentorshipAssignment || []
            if (experience) {
              const filteredbyExp = assignments.filter((assignment: AssignmentType) => {
                        return assignment.mentee.experience === experience;
              }) 
                return filteredbyExp
            } else{
                return assignments
            }
            
        })
        .catch((error) => {
            console.error("Error fetching mentorship assignments:", error);
            return [];
        });
   
    return mentorshipAssignments
}
export default {
    menteeMentorAssignment,
    mentorAcceptMentee,
    mentorRejectMentee,
    getAllRequests,
    UnmatchMentees
}