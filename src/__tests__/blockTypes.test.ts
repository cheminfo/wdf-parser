import { btypes } from '../blockTypes';

test('number of block types', (): void => {
  const keys: number = Object.keys(btypes).length;
  expect(keys).toBe(41);
});
