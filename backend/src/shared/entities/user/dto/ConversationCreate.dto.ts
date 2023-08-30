import { IsNotEmpty, IsDefined } from 'class-validator';
import { IsValidDate } from './decorators/IsValidDate';

export class ConversationCreateDto {
  @IsNotEmpty({ message: 'The waxing time cannot be empty' })
  @IsDefined({ message: 'The waxing time cannot be empty' })
  @IsValidDate({ message: 'The waxing time must be a valid date' })
  public waxing_time: Date;
}
