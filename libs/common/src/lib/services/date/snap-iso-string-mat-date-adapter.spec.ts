import { Platform } from '@angular/cdk/platform';
import { LOCALE_ID } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material';
import { snapMatDateFormats } from './snap-mat-date-format';
import { SnapIsoStringMatDateAdapter } from './snap-iso-string-mat-date-adapter';

const SUPPORTS_INTL = typeof Intl !== 'undefined';

const JAN = 0,
  /*FEB = 1,
  MAR = 2,
  APR = 3,
  MAY = 4,
  JUN = 5,
  JUL = 6,
  AUG = 7,
  SEP = 8,
  OCT = 9,
  NOV = 10,*/
  DEC = 11;

//NOTE these test are almost identical to snap-mat-date-adapter.spec.ts, if you one
//  the same change may be needed in the other.
describe('SnapIsoStringMatDateAdapter', () => {
  describe('format and parse patterns', () => {
    let adapter: SnapIsoStringMatDateAdapter;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MAT_DATE_FORMATS,
            useValue: snapMatDateFormats('DD-MMM-YYYY'),
          },
          { provide: DateAdapter, useClass: SnapIsoStringMatDateAdapter },
        ],
      }).compileComponents();
    }));

    beforeEach(
      inject([DateAdapter], (d: SnapIsoStringMatDateAdapter) => {
        adapter = d;
      })
    );

    describe('YYYY-MM-DD', () => {
      it('should format correctly', () => {
        const date = adapter.format('0300-02-03', 'YYYY-MM-DD');
        expect(date).toBe('0300-02-03');
      });
      it('should parse correctly', () => {
        const dates: [string, string | null][] = [
          ['300-01-01', null],
          ['1977-07-21', '1977-07-21'],
          ['77-07-01', '2077-07-01'],
          ['77-7-21', '2077-07-21'],
          ['7-7-21', null],
          ['07-7-1', '2007-07-01'],
        ];
        dates.forEach(([dateString, expectedDate]) => {
          expect(adapter.parse(dateString, 'YYYY-MM-DD')).toEqual(
            expectedDate,
            dateString
          );
        });
      });
    });

    describe('MM-DD-YYYY', () => {
      it('should format correctly', () => {
        const date = adapter.format('0300-02-03', 'MM-DD-YYYY');
        expect(date).toBe('02-03-0300');
      });
      it('should parse correctly', () => {
        const dates: [string, string | null][] = [
          ['01-01-300', null],
          ['07-21-1977', '1977-07-21'],
          ['07-01-77', '2077-07-01'],
          ['7-21-77', '2077-07-21'],
          ['7-21-7', null],
          ['7-1-07', '2007-07-01'],
        ];
        dates.forEach(([dateString, expectedDate]) => {
          expect(adapter.parse(dateString, 'MM-DD-YYYY')).toEqual(
            expectedDate,
            dateString
          );
        });
      });
    });

    describe('DD-MMM-YYYY', () => {
      it('should format correctly', () => {
        const date = adapter.format('0300-02-03', 'DD-MMM-YYYY');
        expect(date).toBe('03-FEB-0300');
      });
      it('should parse correctly', () => {
        const dates: [string, string | null][] = [
          ['01-JAN-300', null],
          ['21-JUL-1977', '1977-07-21'],
          ['01-JUL-77', '2077-07-01'],
          ['21-JUL-77', '2077-07-21'],
          ['21-JUL-7', null],
          ['1-JUL-07', '2007-07-01'],
        ];
        dates.forEach(([dateString, expectedDate]) => {
          expect(adapter.parse(dateString, 'DD-MMM-YYYY')).toEqual(
            expectedDate,
            dateString
          );
        });
      });
    });
  });

  describe('should pass the same test as NativeDateAdapter', () => {
    const platform = new Platform();
    let adapter: SnapIsoStringMatDateAdapter;
    let assertValidDate: (d: string | null, valid: boolean) => void;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MAT_DATE_FORMATS,
            useValue: snapMatDateFormats('DD-MMM-YYYY'),
          },
          { provide: DateAdapter, useClass: SnapIsoStringMatDateAdapter },
        ],
      }).compileComponents();
    }));

    beforeEach(
      inject([DateAdapter], (dateAdapter: SnapIsoStringMatDateAdapter) => {
        adapter = dateAdapter;

        assertValidDate = (d: string | null, valid: boolean) => {
          expect(adapter.isDateInstance(d)).not.toBeNull(
            `Expected ${d} to be a date instance`
          );
          //tslint:disable-next-line:no-non-null-assertion
          expect(adapter.isValid(d!)).toBe(
            valid,
            `Expected ${d} to be ${valid ? 'valid' : 'invalid'},` +
              ` but was ${valid ? 'invalid' : 'valid'}`
          );
        };
      })
    );

    it('should get year', () => {
      expect(adapter.getYear('2017-01-01')).toBe(2017);
    });

    it('should get month', () => {
      expect(adapter.getMonth('2017-01-01')).toBe(0);
    });

    it('should get date', () => {
      expect(adapter.getDate('2017-01-01')).toBe(1);
    });

    it('should get day of week', () => {
      expect(adapter.getDayOfWeek('2017-01-01')).toBe(0);
    });

    it('should get long month names', () => {
      expect(adapter.getMonthNames('long')).toEqual([
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]);
    });

    it('should get long month names', () => {
      expect(adapter.getMonthNames('short')).toEqual([
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]);
    });

    it('should get narrow month names', () => {
      // Edge & IE use same value for short and narrow.
      if (platform.EDGE || platform.TRIDENT) {
        expect(adapter.getMonthNames('narrow')).toEqual([
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]);
      } else {
        expect(adapter.getMonthNames('narrow')).toEqual([
          'J',
          'F',
          'M',
          'A',
          'M',
          'J',
          'J',
          'A',
          'S',
          'O',
          'N',
          'D',
        ]);
      }
    });

    it('should get month names in a different locale', () => {
      adapter.setLocale('ja-JP');
      if (SUPPORTS_INTL) {
        expect(adapter.getMonthNames('long')).toEqual([
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ]);
      } else {
        expect(adapter.getMonthNames('long')).toEqual([
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]);
      }
    });

    it('should get date names', () => {
      expect(adapter.getDateNames()).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
      ]);
    });

    it('should get date names in a different locale', () => {
      adapter.setLocale('ja-JP');
      if (SUPPORTS_INTL) {
        expect(adapter.getDateNames()).toEqual([
          '1日',
          '2日',
          '3日',
          '4日',
          '5日',
          '6日',
          '7日',
          '8日',
          '9日',
          '10日',
          '11日',
          '12日',
          '13日',
          '14日',
          '15日',
          '16日',
          '17日',
          '18日',
          '19日',
          '20日',
          '21日',
          '22日',
          '23日',
          '24日',
          '25日',
          '26日',
          '27日',
          '28日',
          '29日',
          '30日',
          '31日',
        ]);
      } else {
        expect(adapter.getDateNames()).toEqual([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
          '25',
          '26',
          '27',
          '28',
          '29',
          '30',
          '31',
        ]);
      }
    });

    it('should get long day of week names', () => {
      expect(adapter.getDayOfWeekNames('long')).toEqual([
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]);
    });

    it('should get short day of week names', () => {
      expect(adapter.getDayOfWeekNames('short')).toEqual([
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ]);
    });

    it('should get narrow day of week names', () => {
      // Edge & IE use two-letter narrow days.
      if (platform.EDGE || platform.TRIDENT) {
        expect(adapter.getDayOfWeekNames('narrow')).toEqual([
          'Su',
          'Mo',
          'Tu',
          'We',
          'Th',
          'Fr',
          'Sa',
        ]);
      } else {
        expect(adapter.getDayOfWeekNames('narrow')).toEqual([
          'S',
          'M',
          'T',
          'W',
          'T',
          'F',
          'S',
        ]);
      }
    });

    it('should get day of week names in a different locale', () => {
      adapter.setLocale('ja-JP');
      if (SUPPORTS_INTL) {
        expect(adapter.getDayOfWeekNames('long')).toEqual([
          '日曜日',
          '月曜日',
          '火曜日',
          '水曜日',
          '木曜日',
          '金曜日',
          '土曜日',
        ]);
      } else {
        expect(adapter.getDayOfWeekNames('long')).toEqual([
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]);
      }
    });

    it('should get year name', () => {
      expect(adapter.getYearName('2017-01-01')).toBe('2017');
    });

    it('should get year name in a different locale', () => {
      adapter.setLocale('ja-JP');
      if (SUPPORTS_INTL) {
        expect(adapter.getYearName('2017-01-01')).toBe('2017年');
      } else {
        expect(adapter.getYearName('2017-01-01')).toBe('2017');
      }
    });

    it('should get first day of week', () => {
      expect(adapter.getFirstDayOfWeek()).toBe(0);
    });

    it('should create Date', () => {
      expect(adapter.createDate(2017, JAN, 1)).toEqual('2017-01-01');
    });

    it('should not create Date with month over/under-flow', () => {
      expect(() => adapter.createDate(2017, DEC + 1, 1)).toThrow();
      expect(() => adapter.createDate(2017, JAN - 1, 1)).toThrow();
    });

    it('should not create Date with date over/under-flow', () => {
      expect(() => adapter.createDate(2017, JAN, 32)).toThrow();
      expect(() => adapter.createDate(2017, JAN, 0)).toThrow();
    });

    it('should create Date with low year number', () => {
      //TODO support flintstones - SNAP-591
      //expect(adapter.createDate(-1, JAN, 1)).toBe('-0001-01-01');
      expect(adapter.createDate(0, JAN, 1)).toBe('0000-01-01');
      expect(adapter.createDate(50, JAN, 1)).toBe('0050-01-01');
      expect(adapter.createDate(99, JAN, 1)).toBe('0099-01-01');
      expect(adapter.createDate(100, JAN, 1)).toBe('0100-01-01');
    });

    it("should get today's date", () => {
      expect(
        adapter.sameDate(adapter.today(), adapter.deserialize(new Date()))
      ).toBe(true, "should be equal to today's date");
    });

    it('should parse string', () => {
      expect(adapter.parse('1/1/2017', 'MM-DD-YYYY')).toEqual('2017-01-01');
    });

    // it('should parse number', () => {
    //   const timestamp = 238291200000;
    //   expect(adapter.parse(timestamp, 'MM-DD-YYYY')).toEqual('1977-07-21');
    // });

    //TODO remove if parse is only called with input: https://github.com/angular/material2/issues/6335
    // it ('should parse Date', () => {
    //   const date = '2017-01-01';
    //   expect(adapter.parse(date, 'MM-DD-YYYY')).toEqual(date);
    //   //expect(adapter.parse(date, 'MM-DD-YYYY')).not.toBe(date); //string interning
    // });

    it('should parse invalid value as invalid', () => {
      const d = adapter.parse('hello', 'MM-DD-YYYY');
      expect(adapter.isDateInstance(d)).toBe(
        true,
        'Expected string to have been fed through Date.parse'
      );
      expect(adapter.isValid(d as string)).toBe(
        false,
        "Expected to parse as 'invalid date' object"
      );
    });

    it('should format', () => {
      if (SUPPORTS_INTL) {
        expect(adapter.format('2017-01-01', {})).toEqual('1/1/2017');
      } else {
        expect(adapter.format('2017-01-01', {})).toEqual('Sun Jan 01 2017');
      }
    });

    it('should format with custom format', () => {
      if (SUPPORTS_INTL) {
        expect(
          adapter.format('2017-01-01', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        ).toEqual('January 1, 2017');
      } else {
        expect(
          adapter.format('2017-01-01', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        ).toEqual('Sun Jan 01 2017');
      }
    });

    it('should format with a different locale', () => {
      adapter.setLocale('ja-JP');
      if (SUPPORTS_INTL) {
        // Edge & IE use a different format in Japanese.
        if (platform.EDGE || platform.TRIDENT) {
          expect(adapter.format('2017-01-01', {})).toEqual('2017年1月1日');
        } else {
          expect(adapter.format('2017-01-01', {})).toEqual('2017/1/1');
        }
      } else {
        expect(adapter.format('2017-01-01', {})).toEqual('Sun Jan 01 2017');
      }
    });

    it('should throw when attempting to format invalid date', () => {
      expect(() => adapter.format('$invalid$', {})).toThrowError(
        /DateAdapter: Cannot format invalid date\./
      );
    });

    it('should add years', () => {
      expect(adapter.addCalendarYears('2017-01-01', 1)).toEqual('2018-01-01');
      expect(adapter.addCalendarYears('2017-01-01', -1)).toEqual('2016-01-01');
    });

    it('should respect leap years when adding years', () => {
      expect(adapter.addCalendarYears('2016-02-29', 1)).toEqual('2017-02-28');
      expect(adapter.addCalendarYears('2016-02-29', -1)).toEqual('2015-02-28');
    });

    it('should add months', () => {
      expect(adapter.addCalendarMonths('2017-01-01', 1)).toEqual('2017-02-01');
      expect(adapter.addCalendarMonths('2017-01-01', -1)).toEqual('2016-12-01');
    });

    it('should respect month length differences when adding months', () => {
      expect(adapter.addCalendarMonths('2017-01-31', 1)).toEqual('2017-02-28');
      expect(adapter.addCalendarMonths('2017-03-31', -1)).toEqual('2017-02-28');
    });

    it('should add days', () => {
      expect(adapter.addCalendarDays('2017-01-01', 1)).toEqual('2017-01-02');
      expect(adapter.addCalendarDays('2017-01-01', -1)).toEqual('2016-12-31');
    });

    it('should clone', () => {
      const date = '2017-01-01';
      expect(adapter.clone(date)).toEqual(date);
      //javascript strings are interned
      //expect(adapter.clone(date)).not.toBe(date);
    });

    it('should compare dates', () => {
      expect(adapter.compareDate('2017-01-01', '2017-01-02')).toBeLessThan(0);
      expect(adapter.compareDate('2017-01-01', '2017-02-01')).toBeLessThan(0);
      expect(adapter.compareDate('2017-01-01', '2018-01-01')).toBeLessThan(0);
      expect(adapter.compareDate('2017-01-01', '2017-01-01')).toBe(0);
      expect(adapter.compareDate('2018-01-01', '2017-01-01')).toBeGreaterThan(
        0
      );
      expect(adapter.compareDate('2017-02-01', '2017-01-01')).toBeGreaterThan(
        0
      );
      expect(adapter.compareDate('2017-01-02', '2017-01-01')).toBeGreaterThan(
        0
      );
    });

    it('should clamp date at lower bound', () => {
      expect(
        adapter.clampDate('2017-01-01', '2018-01-01', '2019-01-01')
      ).toEqual('2018-01-01');
    });

    it('should clamp date at upper bound', () => {
      expect(
        adapter.clampDate('2020-01-01', '2018-01-01', '2019-01-01')
      ).toEqual('2019-01-01');
    });

    it('should clamp date already within bounds', () => {
      expect(
        adapter.clampDate('2018-02-01', '2018-01-01', '2019-01-01')
      ).toEqual('2018-02-01');
    });

    it('should use UTC for formatting by default', () => {
      if (SUPPORTS_INTL) {
        expect(adapter.format('1800-08-14', { day: 'numeric' })).toBe('14');
      } else {
        expect(adapter.format('1800-08-14', { day: 'numeric' })).toBe(
          'Thu Aug 14 1800'
        );
      }
    });

    it('should count today as a valid date instance', () => {
      const d = adapter.today();
      expect(adapter.isValid(d)).toBe(true);
      expect(adapter.isDateInstance(d)).toBe(true);
    });

    it('should count an invalid date as an invalid date instance', () => {
      const d = adapter.invalid();
      expect(adapter.isValid(d)).toBe(false, 'isValid');
      expect(adapter.isDateInstance(d)).toBe(true, 'isDateInstance');
    });

    it('should count a string as not a date instance', () => {
      const d = '1/1/2017';
      expect(adapter.isDateInstance(d)).toBe(false);
    });

    it('should create dates from valid ISO strings', () => {
      assertValidDate(adapter.deserialize('1985-04-12T23:20:50.52Z'), true);
      assertValidDate(adapter.deserialize('1996-12-19T16:39:57-08:00'), true);
      assertValidDate(
        adapter.deserialize('1937-01-01T12:00:27.87+00:20'),
        true
      );
      assertValidDate(adapter.deserialize('2017-01-01'), true);
      assertValidDate(adapter.deserialize('2017-01-01T00:00:00'), true);
      assertValidDate(adapter.deserialize('1990-13-31T23:59:00Z'), false);
      assertValidDate(adapter.deserialize('1/1/2017'), false);
      assertValidDate(adapter.deserialize('2017-01-01T'), false);
      expect(adapter.deserialize('')).toBeNull();
      expect(adapter.deserialize(null)).toBeNull();
      assertValidDate(adapter.deserialize(new Date()), true);
      assertValidDate(adapter.deserialize(new Date(NaN)), false);
    });

    it('should create an invalid date', () => {
      assertValidDate(adapter.invalid(), false);
    });
  });

  describe('DateAdapter with MAT_DATE_LOCALE override', () => {
    let adapter: SnapIsoStringMatDateAdapter;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: MAT_DATE_LOCALE, useValue: 'da-DK' },
          {
            provide: MAT_DATE_FORMATS,
            useValue: snapMatDateFormats('DD-MMM-YYYY'),
          },
          { provide: DateAdapter, useClass: SnapIsoStringMatDateAdapter },
        ],
      }).compileComponents();
    }));

    beforeEach(
      inject([DateAdapter], (d: SnapIsoStringMatDateAdapter) => {
        adapter = d;
      })
    );

    it('should take the default locale id from the MAT_DATE_LOCALE injection token', () => {
      const expectedValue = SUPPORTS_INTL
        ? [
            'søndag',
            'mandag',
            'tirsdag',
            'onsdag',
            'torsdag',
            'fredag',
            'lørdag',
          ]
        : [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];

      expect(adapter.getDayOfWeekNames('long')).toEqual(expectedValue);
    });
  });

  describe('DateAdapter with LOCALE_ID override', () => {
    let adapter: SnapIsoStringMatDateAdapter;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LOCALE_ID, useValue: 'da-DK' },
          {
            provide: MAT_DATE_FORMATS,
            useValue: snapMatDateFormats('DD-MMM-YYYY'),
          },
          { provide: DateAdapter, useClass: SnapIsoStringMatDateAdapter },
        ],
      }).compileComponents();
    }));

    beforeEach(
      inject([DateAdapter], (d: SnapIsoStringMatDateAdapter) => {
        adapter = d;
      })
    );

    it('should cascade locale id from the LOCALE_ID injection token to MAT_DATE_LOCALE', () => {
      const expectedValue = SUPPORTS_INTL
        ? [
            'søndag',
            'mandag',
            'tirsdag',
            'onsdag',
            'torsdag',
            'fredag',
            'lørdag',
          ]
        : [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];

      expect(adapter.getDayOfWeekNames('long')).toEqual(expectedValue);
    });
  });
});
