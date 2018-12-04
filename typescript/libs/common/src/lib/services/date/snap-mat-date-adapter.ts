import { MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material';
import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

function pad0(num: number, len: number) {
  return ('0000' + num).substr(-len);
}

function pad02(num: number) {
  return pad0(num, 2);
}
function pad04(num: number) {
  return pad0(num, 4);
}

@Injectable()
export class SnapMatDateAdapter extends NativeDateAdapter {
  constructor(
    platform: Platform,
    @Optional()
    @Inject(LOCALE_ID)
    localeId?: any,
    @Optional()
    @Inject(MAT_DATE_LOCALE)
    matLocaleId?: any
  ) {
    super(matLocaleId || localeId, platform);
  }

  deserialize(value: any): Date | null {
    //The native date adapter uses the Date constructor, but that
    //  treats dates without times as UTC, but the native date adapter uses
    //  the users local timezone.  They try to work around this by
    //  making toIso8601 use UTC time, but that causes confusion since the
    //  date string produced doesn't always match the date the user chose.
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}Z?$/.test(value)) {
      return this.parse(value.substring(0, 10), 'YYYY-MM-DD');
    }

    return super.deserialize(value);
  }

  toIso8601(date: Date): string {
    return this.format(date, 'YYYY-MM-DD');
  }

  format(date: Date, displayFormat: Object): string {
    if (date === null || date === undefined || !this.isValid(date)) {
      throw Error('DateAdapter: Cannot format invalid date.');
    }
    if (typeof displayFormat !== 'string') {
      return super.format(date, displayFormat);
    }

    switch (displayFormat) {
      case 'YYYY-MM-DD':
        return `${pad04(date.getFullYear())}-${pad02(
          date.getMonth() + 1
        )}-${pad02(date.getDate())}`;
      case 'MM-DD-YYYY':
        return `${pad02(date.getMonth() + 1)}-${pad02(date.getDate())}-${pad04(
          date.getFullYear()
        )}`;
      case 'DD-MMM-YYYY':
        return `${pad02(date.getDate())}-${
          this.getMonthNames('short')[date.getMonth()]
        }-${pad04(date.getFullYear())}`.toUpperCase();
      default:
        throw new Error(`Invalid date format ${displayFormat}`);
    }
  }

  //Because we are extending NativeDateFormat, parseFormat needs to be optional :>(
  parse(value: any, parseFormat?: any): Date | null {
    if (typeof parseFormat !== 'string') {
      throw new Error(`Invalid or missing parseFormat ${parseFormat}`);
    }

    if (value instanceof Date || typeof value === 'number') {
      return super.parse(value);
    } //TODO what is going on here??? - SNAP-591

    //When is value something other than string or null/undefined???
    if (value === undefined || value === null) {
      return value;
    }
    if (typeof value !== 'string') {
      console.error('Unknown date parse type', value);
      throw new Error(`'Unknown date parse type ${typeof value}`);
    }
    if (value.trim() === '') {
      return null;
    }

    const parts = value.split(/[-/.]/);
    if (parts.length !== 3) {
      return new Date(NaN);
    }

    let ret: { year: number | null; month: number | null; date: number | null };
    switch (parseFormat) {
      case 'YYYY-MM-DD':
        ret = {
          year: this.parseYear(parts[0]),
          month: this.parse2digit(parts[1]),
          date: this.parse2digit(parts[2]),
        };
        break;
      case 'MM-DD-YYYY':
        ret = {
          year: this.parseYear(parts[2]),
          month: this.parse2digit(parts[0]),
          date: this.parse2digit(parts[1]),
        };
        break;
      case 'DD-MMM-YYYY':
        ret = {
          year: this.parseYear(parts[2]),
          month: this.parseMonthName(parts[1]),
          date: this.parse2digit(parts[0]),
        };
        break;
      default:
        throw new Error(`Invalid date format ${parseFormat}`);
    }

    if (
      ret === null ||
      ret.year === null ||
      ret.month === null ||
      ret.date === null
    ) {
      return null;
    }

    try {
      return this.createDate(ret.year, ret.month - 1, ret.date);
    } catch (e) {
      return new Date(NaN);
    }
  }

  private parseYear(str: string): number | null {
    if (!str || !/^([0-9]{2}|[0-9]{4})$/.test(str)) {
      return null;
    }

    return str.length === 2 ? 2000 + +str : +str;
  }

  private parse2digit(str: string): number | null {
    if (!str || !/^[0-9]{1,2}$/.test(str)) {
      return null;
    }

    return +str;
  }

  private parseMonthName(str: string): number | null {
    return (
      this.getMonthNames('short').findIndex(
        name => name.toUpperCase() === str.toUpperCase()
      ) + 1
    );
  }
}
