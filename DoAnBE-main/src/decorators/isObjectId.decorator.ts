import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ async: true })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return mongoose.Types.ObjectId.isValid(value);
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdConstraint,
    });
  };
}
