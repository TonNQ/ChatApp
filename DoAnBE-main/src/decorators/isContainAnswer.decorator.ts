import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsContainAnswerConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const answer = args.object['answer'];

    return value.includes(answer);
  }
}

export function IsContainAnswer(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsContainAnswerConstraint,
    });
  };
}
