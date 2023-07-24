import { UnauthenticatedError } from "../errors";

export const adminRequired = (req, res, next) => {
   if (req.user && req.user.role === 'admin') {
      next();
   } else {
      throw new UnauthenticatedError(
         'Unauthorized user, admin access required.'
      );
   }
};
