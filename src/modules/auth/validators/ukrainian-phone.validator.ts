import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ukrainianPhone', async: false })
export class UkrainianPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return true; // Allow empty values, other validators will handle required
    
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Ukrainian phone number patterns:
    // +380XXXXXXXXX (13 digits total)
    // 380XXXXXXXXX (12 digits)
    // 0XXXXXXXXX (10 digits)
    const patterns = [
      /^380\d{9}$/, // 380 + 9 digits
      /^0\d{9}$/,   // 0 + 9 digits
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number must be a valid Ukrainian phone number (e.g., +380501234567, 380501234567, or 0501234567)';
  }
}

export function UkrainianPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UkrainianPhoneConstraint,
    });
  };
}







