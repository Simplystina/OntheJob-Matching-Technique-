import { AssignmemtStatus, Experience} from '@prisma/client';
import Joi from 'joi';



const getMentorsRequests = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(AssignmemtStatus)),
    exp : Joi.string().valid(...Object.values(Experience))
  })
};

export default {
    getMentorsRequests
}