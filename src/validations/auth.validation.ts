import Joi from 'joi';
import { password } from './custom.validation';
import { Gender, Experience } from '@prisma/client';

const mentorRegister = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    uid: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    photo: Joi.string(),
    gender: Joi.string().valid(...Object.values(Gender)), 
    mentorshipPath: Joi.array().items(Joi.string()).required(), 
    skills: Joi.array().items(Joi.string()).required(),
    password: Joi.string().required()
  }),
};

const menteeRegister = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    uid: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    photo: Joi.string(),
    gender: Joi.string().valid(...Object.values(Gender)), 
    learningPaths: Joi.array().items(Joi.string()).required(), 
    skills: Joi.array().items(Joi.string()).required(),
    experienceLevel: Joi.string().valid(...Object.values(Experience)).required(),
    password: Joi.string().required()
  }),
};

const businessRegister = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    uid: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    photo: Joi.string(),
    gender: Joi.string().valid(...Object.values(Gender)).required(), 
    hiringSector: Joi.array().items(Joi.string()).required(), 
    tracks: Joi.array().items(Joi.string()).required(),
     password: Joi.string().required()
  }),
};

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string(),
    gender: Joi.string().valid(...Object.values(Gender)).required()
  })
};

const socialRegister = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    uid: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    photo: Joi.string()
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
};

const socialLogin = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    uid: Joi.string().required()
  })
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};

export default {
  register,
  socialRegister,
  mentorRegister,
  menteeRegister,
  businessRegister,
  login,
  socialLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail
};
