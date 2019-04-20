import sum from '../../src/ts/sum';

describe('Test Math class functions', () => {
    test('adding 1 + 2 is equal to 3', () => {
        expect(sum(1, 2)).toBe(3);
    });
});
