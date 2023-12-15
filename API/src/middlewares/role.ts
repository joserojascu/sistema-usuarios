import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/User';

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals.jwtPayload;
    console.log(userId , "id user")
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(userId);
    } catch (e) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    //Check
    const { rol } = user;
    if (roles.includes(rol)) {
      next();
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  };
};