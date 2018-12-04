//Typescript seems to be a little too "smart", and doesn't realize
//  the callbacks in our test could change our test value to a
//  real value instead of undefined.  This makes it so it's uncertain
//  and assumes it could have a value instead of assuming it must be undefined.
export function maybe<T>(t?: T): T | undefined {
  return t;
}

//type guard that can be used to strip null and/or undefined from a type
export function isPresent<T>(t: T | null | undefined): t is T {
  return t !== null && t !== undefined;
}

//For some reason const numbers: number[] = [null, 1].filter(isPresent) didn't work
//  const numbers: number[] = [null, 1].filter(mkIsPresentGuard()) should work
export function mkIsPresentGuard<T>(): (t: T | null | undefined) => t is T {
  return (t): t is T => t !== null && t !== undefined;
}

//type guard that can be used to strip null and/or undefined from a type
export function assertPresent<T>(t: T | null | undefined): T {
  if (!isPresent(t)) {
    throw new Error('Expected value to be defined');
  }
  return t;
}

export type Nullable<T> = { [P in keyof T]: T[P] | null };

//Used in cases were typescript needs to be helped to know what type you
//  want your object literal to be const foo = asA<Foo>({bar: 'baz'});
export function asA<T>(t: T) {
  return t;
}
