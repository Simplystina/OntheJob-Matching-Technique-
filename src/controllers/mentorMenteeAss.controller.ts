import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import menteeMentorAss from '../services/menteeMentorAss.service';
import { AssignmemtStatus, Experience } from '@prisma/client';

const mentorMenteeMatching = catchAsync(async (req, res) => {
  const match: any = await menteeMentorAss.menteeMentorAssignment();
  //res.status(httpStatus.CREATED).send()
  res.status(httpStatus.CREATED).json({message:"Matching has been successfully made", noOfMenteesMatched:match.count});
});

const mentorAcceptMentee = catchAsync(async (req, res) => {
  const { id } = req.params
   const user = req.user
  const data = await menteeMentorAss.mentorAcceptMentee(id, user);
  res.status(httpStatus.OK).json({message:"Successfully accepted this mentee", data:data});
});

const mentorRejectMentee = catchAsync(async (req, res) => {
  const { id } = req.params
   const user = req.user
  const data = await menteeMentorAss.mentorRejectMentee(id, user);
  res.status(httpStatus.OK).json({message:"Successfully rejected this mentee", data:data});
});

const getAllRequests = catchAsync(async (req,res) => {
  const { status, exp} = req.query
  let statusQuery = status as AssignmemtStatus ;
  let expQuery = exp as Experience  ;
   const user = req.user 
  const data = await menteeMentorAss.getAllRequests( statusQuery, expQuery, user)
   res.status(httpStatus.OK).json({message:"Successfully retrieved all data", data:data});
})

export default {
  mentorMenteeMatching,
  mentorAcceptMentee,
  mentorRejectMentee,
 getAllRequests
}