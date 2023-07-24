import { NotFoundError } from '../errors';

export const error404 = (req, res) => {
   throw new NotFoundError('Route not found');
};
