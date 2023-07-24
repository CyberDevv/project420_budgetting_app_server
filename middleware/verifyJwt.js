import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {
   if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
   ) {
      jwt.verify(
         req.headers.authorization.split(' ')[1],
         process.env.JWT_SECRET,
         (err, decode) => {
            if (err) req.user = undefined;
            req.user = decode;
            next();
         }
      );
   } else {
      req.user = undefined;
      next();
   }
};
