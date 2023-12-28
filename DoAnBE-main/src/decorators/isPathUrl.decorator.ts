import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import path from 'path';
import fs from 'fs';

const PATH = '/public/uploads/';
@ValidatorConstraint({ async: true })
export class IsPathUrlConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const fileExist = fs.existsSync(path.join(__dirname, `../../src/${value}`));
    return value && value.startsWith(PATH) && fileExist;
  }
}

export function IsPathUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPathUrlConstraint,
    });
  };
}
