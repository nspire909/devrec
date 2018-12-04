import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { SnapMatDateAdapter } from './snap-mat-date-adapter';
import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';

//TODO this class only supports one variant of ISO dates (YYY-MM-DD), not time or timezone parts, etc - SNAP-591
//TODO this class could be much more efficient if it did some of the obvious stuff directly with the strings - SNAP-591
//  instead of translating and passing every thing to the Date based DateAdapter
@Injectable()
export class SnapIsoStringMatDateAdapter extends DateAdapter<string> {
  invalid(): string {
    return '$invalid$';
  }

  deserialize(value: any): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (this.isDateInstance(value)) {
      return value;
    }
    return this.dateToString(this.dateAdapter.deserialize(value));
  }

  private stringToDate(iso_date: string): Date;
  private stringToDate(iso_date: string | null): Date | null;
  private stringToDate(iso_date: string | null): Date | null {
    if (iso_date === null || iso_date === undefined || iso_date === '') {
      return null;
    }
    if (iso_date === '$invalid$') {
      return this.dateAdapter.invalid();
    }
    if (typeof iso_date !== 'string') {
      throw new Error(`expected string <${typeof iso_date}>`);
    }

    const ret = this.dateAdapter.deserialize(iso_date);
    if (!ret) {
      throw new Error(`'Unexpected null date from: ${iso_date}`);
    }
    return ret;
  }

  private dateToString(date: Date): string;
  private dateToString(date: Date | null): string | null;
  private dateToString(date: Date | null): string | null {
    if (!date) {
      return null;
    }
    if (isNaN(date.getTime())) {
      return this.invalid();
    }
    return this.dateAdapter.toIso8601(date);
  }

  private dateAdapter: SnapMatDateAdapter;

  protected get locale(): any {
    return (<any>this.dateAdapter).locale;
  }
  protected set locale(loc: any) {
    (<any>this.dateAdapter).locale = loc;
  }

  constructor(
    @Optional()
    @Inject(LOCALE_ID)
    localeId?: any,
    @Optional()
    @Inject(MAT_DATE_LOCALE)
    matLocaleId?: any
  ) {
    super();
    this.dateAdapter = new SnapMatDateAdapter(localeId, matLocaleId);
  }

  parse(value: any, parseFormat: any): any | string {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return this.dateToString(this.dateAdapter.parse(value, parseFormat));
  }

  format(date: string, displayFormat: any): string {
    return this.dateAdapter.format(this.stringToDate(date), displayFormat);
  }

  getYear(date: string): number {
    return this.dateAdapter.getYear(this.stringToDate(date));
  }
  getMonth(date: string): number {
    return this.dateAdapter.getMonth(this.stringToDate(date));
  }
  getDate(date: string): number {
    return this.dateAdapter.getDate(this.stringToDate(date));
  }
  getDayOfWeek(date: string): number {
    return this.dateAdapter.getDayOfWeek(this.stringToDate(date));
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return this.dateAdapter.getMonthNames(style);
  }
  getDateNames(): string[] {
    return this.dateAdapter.getDateNames();
  }
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return this.dateAdapter.getDayOfWeekNames(style);
  }

  getYearName(date: string): string {
    return this.dateAdapter.getYearName(this.stringToDate(date));
  }

  getFirstDayOfWeek(): number {
    return this.dateAdapter.getFirstDayOfWeek();
  }
  getNumDaysInMonth(date: string): number {
    return this.dateAdapter.getNumDaysInMonth(this.stringToDate(date));
  }

  clone(date: string): string {
    return date;
  }

  createDate(year: number, month: number, date: number): string {
    return this.dateToString(this.dateAdapter.createDate(year, month, date));
  }

  today(): string {
    return this.dateToString(this.dateAdapter.today());
  }

  addCalendarYears(date: string, years: number): string {
    return this.dateToString(
      this.dateAdapter.addCalendarYears(this.stringToDate(date), years)
    );
  }

  addCalendarMonths(date: string, months: number): string {
    return this.dateToString(
      this.dateAdapter.addCalendarMonths(this.stringToDate(date), months)
    );
  }

  addCalendarDays(date: string, days: number): string {
    return this.dateToString(
      this.dateAdapter.addCalendarDays(this.stringToDate(date), days)
    );
  }

  toIso8601(date: string): string {
    return date;
  }

  setLocale(locale: any): void {
    this.dateAdapter.setLocale(locale);
  }

  compareDate(first: string, second: string): number {
    return this.dateAdapter.compareDate(
      this.stringToDate(first),
      this.stringToDate(second)
    );
  }

  sameDate(first: any | string, second: any | string): boolean {
    return this.dateAdapter.sameDate(
      this.stringToDate(first),
      this.stringToDate(second)
    );
  }

  clampDate(date: string, min?: any | string, max?: any | string): string {
    return this.dateToString(
      this.dateAdapter.clampDate(
        this.stringToDate(date),
        this.stringToDate(min),
        this.stringToDate(max)
      )
    );
  }

  isDateInstance(obj: any) {
    return (
      typeof obj === 'string' &&
      /^[$]invalid[$]|[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(obj)
    );
  }

  isValid(date: string) {
    return !!date && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
  }
}
