import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like 2023-08-26T20:00:27.900Z',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return (
            typeof value === 'string' &&
            regex.test(value) &&
            !isNaN(Date.parse(value))
          );
        },
      },
    });
  };
}
