import express from 'express';
import menteeMentorAssRoute from "./mentorMenteeAss.router"
import requestRoute  from "./request.route"

const router = express.Router();

const defaultRoutes = [
 
 
  {
    path: '/match',
    route: menteeMentorAssRoute
  },
   {
    path: '/requests',
    route: requestRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
