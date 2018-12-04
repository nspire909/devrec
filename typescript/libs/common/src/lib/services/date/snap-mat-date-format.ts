import { MAT_NATIVE_DATE_FORMATS, MatDateFormats } from '@angular/material';

export type SnapDateFormat = 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MMM-YYYY';
export function snapMatDateFormats(format: SnapDateFormat): MatDateFormats {
  return {
    parse: {
      dateInput: format,
    },
    display: {
      ...MAT_NATIVE_DATE_FORMATS.display,
      dateInput: format,
    },
  };
}

export function isSnapDateFormat(fmt: string): fmt is SnapDateFormat {
  switch (fmt) {
    case 'MM-DD-YYYY':
    case 'DD-MMM-YYYY':
    case 'YYYY-MM-DD':
      return true;
    default:
      return false;
  }
}

export function assertIsSnapDateFormat(fmt: string): SnapDateFormat {
  if (isSnapDateFormat(fmt)) {
    return fmt;
  } else {
    throw new Error(`Invalid SnapDateFormat: ${fmt}`);
  }
}
