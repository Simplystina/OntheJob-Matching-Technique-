import express from 'express';
import mentorMenteeAssController from '../../controllers/mentorMenteeAss.controller';
import auth from '../../middlewares/auth';

const router = express.Router();
router
  .route('/')
  .get(auth('matchUsers'), mentorMenteeAssController.mentorMenteeMatching);
 

// router
//   .route('/unaccepted')
//  .get(auth('matchUsers'), mentorMenteeAssController.unMatchMentees);

export default router