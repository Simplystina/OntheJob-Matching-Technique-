//Perform matching based on skillset, gender and location
//This matches user to the first mentor that matches his skillset
export async function matchByFirst(availableMentees: any, availableMentors: any) {

   
    const matchedUsers = []
    const matchedMentees:string[] = []
    const countOfMentorsMatch: any = {}
   
    for (let i = 0; i < availableMentees.length; i++) {
        const userMentee = availableMentees[i];
        for (let j = 0; j < availableMentors.length; j++) {
            const userMentor = availableMentors[j];
            if (userMentee.role !== userMentor.role &&
                userMentee.stateOfResidence === userMentor.stateOfResidence &&
                userMentee.gender === userMentor.gender &&
                userMentor.mentor?.mentee.length < 5 &&
                userMentor.mentor.countOfAssignedMentees < 5 &&
                userMentor.mentor.MentorshipAssignment.length < 10 
                
            ) {

              if (
                userMentee.mentee.MentorshipAssignment.length === 0 ||
                userMentee.mentee.MentorshipAssignment.every(
                    (assignment:any) => assignment.status === 'MENTOR_REJECTED'
                )
                ) {
                    const menteeSkills = userMentee.mentee.areaOfInterest.map((skill: any) => skill.id)
                    const mentorSkills = userMentor.mentor.mentorshipPath.map((skill: any) => skill.id)
                    
                    const commonSkills = menteeSkills.filter((path: any) =>
                    mentorSkills.includes(path))
                    if (commonSkills.length > 0) {
                        if (!matchedMentees.includes(userMentee.id)) {
                            if (countOfMentorsMatch[userMentor.id] == undefined) {
                                matchedUsers.push({ userMentee, userMentor, commonSkills })
                                matchedMentees.push(userMentee.id)
                                if (userMentor.mentor.MentorshipAssignment.length === 0) {
                                    countOfMentorsMatch[userMentor.id] =  1
                                } else {
                                    countOfMentorsMatch[userMentor.id] = userMentor.mentor.MentorshipAssignment.length
                                }
                            } else {
                                if (countOfMentorsMatch[userMentor.id] < 10) {
                                    matchedUsers.push({ userMentee, userMentor, commonSkills })
                                        matchedMentees.push(userMentee.id)
                                    countOfMentorsMatch[userMentor.id] = countOfMentorsMatch[userMentor.id] + 1
                                }
                            }
                        }
                    
                    }
                }


            }
        
        
        }

    
    }
    return matchedUsers
}


//Perform matching based on skillset, gender and location
//This matches user to the mentor with his highest set of skill
export async function matchByHighestSkill(availableMentees: any, availableMentors: any) {
   
    const matchedUsers = []
    const countOfMentorsMatch: any = {}
   
    for (let i = 0; i < availableMentees.length; i++) {
        const userMentee = availableMentees[i];
        const menteeMatchCount: any= []
        for (let j = 0; j < availableMentors.length; j++) {
            const userMentor = availableMentors[j];
            
            if (userMentee.role !== userMentor.role &&
                userMentee.stateOfResidence === userMentor.stateOfResidence &&
                userMentee.gender === userMentor.gender &&
                userMentor.mentor?.mentee.length < 5 &&
                userMentor.mentor.countOfAssignedMentees < 5 &&
                userMentor.mentor.MentorshipAssignment.length < 10 
            ) {

              if (
                userMentee.mentee.MentorshipAssignment.length === 0 ||
                userMentee.mentee.MentorshipAssignment.every(
                    (assignment:any) => assignment.status === 'MENTOR_REJECTED'
                )
                ) {
                    const menteeSkills = userMentee.mentee.areaOfInterest.map((skill: any) => skill.id)
                    const mentorSkills = userMentor.mentor.mentorshipPath.map((skill: any) => skill.id)
                    
                    const commonSkills = menteeSkills.filter((path: any) =>
                        mentorSkills.includes(path))
                  if (commonSkills.length > 0) {
                      menteeMatchCount.push({userMentor,commonSkills})
                    }
                }
            }
        }
       if (menteeMatchCount.length > 0) {
            const objectWithHighestSkill = menteeMatchCount.reduce((maxskill:any, currentskill:any) => {
            
                if (currentskill.commonSkills.length > maxskill.commonSkills.length) {
                    return currentskill 
                } else {
                    return maxskill; 
                }
            }, menteeMatchCount[0])
            
            if (countOfMentorsMatch[objectWithHighestSkill.userMentor.id] == undefined) {
                    matchedUsers.push({ userMentee, userMentor: objectWithHighestSkill.userMentor, commonSkills: objectWithHighestSkill.commonSkills })
                    
                    if (objectWithHighestSkill.userMentor.mentor.MentorshipAssignment.length === 0) {
                        countOfMentorsMatch[objectWithHighestSkill.userMentor.id] =  1
                    } else {
                        countOfMentorsMatch[objectWithHighestSkill.userMentor.id] = objectWithHighestSkill.userMentor.mentor.MentorshipAssignment.length
                    }
                } else {
                    if (countOfMentorsMatch[objectWithHighestSkill.userMentor.id] < 10) {
                        matchedUsers.push({ userMentee, userMentor: objectWithHighestSkill.userMentor, commonSkills: objectWithHighestSkill.commonSkills })
                        countOfMentorsMatch[objectWithHighestSkill.userMentor.id] = countOfMentorsMatch[objectWithHighestSkill.userMentor.id] + 1
                    }
            }
        }
    
    }
    return matchedUsers
}



