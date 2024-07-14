import { ChangeEvent } from 'react';

export interface Field {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
