import 'ts-jest';
import { pipe } from './pipe';

const ADD = (a: number, b: number): number => a + b;
const SUB = (a: number, b: number): number => a - b;
const MUL = (a: number, b: number): number => a * b;
const DIV = (a: number, b: number): number => a / b;

describe('Pipe should preserve the function', () => {
  it('ADD should return the same as a pipe of one ADD', () => {
    const param1: number = 5,
      param2: number = 5;
    const ADD_PIPE = pipe(ADD, pipe.$, pipe.$);
    expect(ADD(param1, param2)).toBe(ADD_PIPE(param1, param2));
  });
  it('SUB should return the same as a pipe of one SUB', () => {
    const param1: number = 5,
      param2: number = 5;
    const SUB_PIPE = pipe(SUB, pipe.$, pipe.$);
    expect(SUB(param1, param2)).toBe(SUB_PIPE(param1, param2));
  });
  it('MUL should return the same as a pipe of one MUL', () => {
    const param1: number = 5,
      param2: number = 5;
    const MUL_PIPE = pipe(MUL, pipe.$, pipe.$);
    expect(MUL(param1, param2)).toBe(MUL_PIPE(param1, param2));
  });
  it('DIV should return the same as a pipe of one DIV', () => {
    const param1: number = 5,
      param2: number = 5;
    const DIV_PIPE = pipe(DIV, pipe.$, pipe.$);
    expect(DIV(param1, param2)).toBe(DIV_PIPE(param1, param2));
  });
});

describe('Composing functions', () => {
  it('ADD then ADD', () => {
    const param1: number = 3,
      param2: number = 5,
      param3: number = 8;
    const ADD3_PIPE = pipe(ADD, pipe.$, pipe.$).pipe(ADD, pipe._, pipe.$);
    expect(ADD(ADD(param1, param2), param3)).toBe(
      ADD3_PIPE(param1, param2, param3),
    );
  });
});
