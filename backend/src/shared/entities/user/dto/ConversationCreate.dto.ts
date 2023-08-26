import { IsNotEmpty, IsDefined, IsDate } from 'class-validator';

export class ConversationCreateDto {
  @IsNotEmpty({ message: 'A data de usuário não pode ser vazia' })
  @IsDefined({ message: 'A data de usuário não pode ser vazia' })
  @IsDate({ message: 'A data de usuário tem que ser uma data valida' })
  public waxing_time: Date;
}
