import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Ensures the decorated property value differs from the value of another property.
 * Usage: @IsDifferentFrom('oldPassword', { message: 'New password must be different from old password' })
 */
export function IsDifferentFrom(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isDifferentFrom',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (typeof value !== 'string' || typeof relatedValue !== 'string') {
            return true; // Non-string validation is delegated to other decorators.
          }
          return value !== relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be different from ${relatedPropertyName}`;
        },
      },
    });
  };
}
