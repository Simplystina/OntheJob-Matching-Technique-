import express from 'express';
import mentorMenteeAssController from '../../controllers/mentorMenteeAss.controller';
import auth from '../../middlewares/auth';
import requestsValidation from '../../validations/requests.validation';
import validate from '../../middlewares/validate';

const router = express.Router();


router
  .route('/accept/:id')
 .get(auth('request'), mentorMenteeAssController.mentorAcceptMentee);

router
.route('/reject/:id')
.get(auth('request'), mentorMenteeAssController.mentorRejectMentee);

router
.route('/mentor/all')
    .get(auth('request'), validate(requestsValidation), mentorMenteeAssController.getAllRequests);

export default router