import { JwtPayload } from 'jsonwebtoken';
import IPayload from '../../../shared/entities/auth/interfaces/IPayload';

export interface IDecoded extends JwtPayload {
  tokenData: IPayload;
}
