import { IsNotEmpty, IsDefined } from 'class-validator';
import { IsValidDate } from './decorators/IsValidDate';

export class ConversationCreateDto {
  @IsNotEmpty({ message: 'A data de enceramento não pode ser vazia' })
  @IsDefined({ message: 'A data de enceramento não pode ser vazia' })
  @IsValidDate({ message: 'A data de enceramento tem que ser uma data válida' })
  public waxing_time: Date;
}
