import { ChangeEvent } from 'react';

export interface SignupField {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  description: string;
}
