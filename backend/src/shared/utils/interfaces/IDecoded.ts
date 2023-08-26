import { JwtPayload } from 'jsonwebtoken';
import IPayload from 'src/shared/entities/auth/interfaces/IPayload';

export interface IDecoded extends JwtPayload {
  tokenData: IPayload;
}
