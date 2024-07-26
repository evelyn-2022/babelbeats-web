import { ChangeEvent } from 'react';
import { ValidatedFields } from '../../types';

export interface SignupField {
  id: keyof ValidatedFields;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  description: string;
}
