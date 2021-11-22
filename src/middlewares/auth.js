/* eslint-disable consistent-return */
import * as sessionService from '../services/sessionService';

export default async function auth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split('Bearer ')[1];
  if (!token) return res.sendStatus(401);

  const user = await sessionService.findUser(token);
  if (!user) return res.sendStatus(401);

  res.locals.user = user;

  next();
}
