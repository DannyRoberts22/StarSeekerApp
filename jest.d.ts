import '@testing-library/jest-native/extend-expect';

declare global {
  var describe: typeof import('@jest/globals').describe;
  var it: typeof import('@jest/globals').it;
  var test: typeof import('@jest/globals').test;
  var expect: typeof import('@jest/globals').expect;
  var beforeEach: typeof import('@jest/globals').beforeEach;
  var afterEach: typeof import('@jest/globals').afterEach;
  var beforeAll: typeof import('@jest/globals').beforeAll;
  var afterAll: typeof import('@jest/globals').afterAll;
  var jest: typeof import('@jest/globals').jest;

  namespace jest {
    interface MockedFunction<T extends (...args: never[]) => unknown> {
      (...args: Parameters<T>): ReturnType<T>;
      mockReturnValue(value: ReturnType<T>): this;
      mockReturnValueOnce(value: ReturnType<T>): this;
      mockResolvedValue(value: Awaited<ReturnType<T>>): this;
      mockRejectedValue(value: unknown): this;
      mockImplementation(fn: T): this;
      mockImplementationOnce(fn: T): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): void;
    }
  }
}

export {};
