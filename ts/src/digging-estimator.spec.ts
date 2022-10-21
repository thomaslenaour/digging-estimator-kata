import { DiggingEstimator } from './digging-estimator';

describe('digging estimator', () => {
  let estimator: DiggingEstimator;

  beforeEach(() => {
    estimator = new DiggingEstimator();
  });
  it('should return as Dr Pockovsky said', () => {
    // To have it work, you need to go set the rates to [0, 3, 5.5, 7]
    const result = estimator.tunnel(28, 2, 'granite');

    expect(result.total).toBe(48);
  });

  describe('should throw an exception', () => {
    describe('InvalidFormatException', () => {
      it('should return a format error when `length` is invalid', () => {
        expect(() => estimator.tunnel(NaN, 2, 'granite')).toThrowError();
      });

      it('should return a format error when `days` is invalid', () => {
        expect(() => estimator.tunnel(28, NaN, 'granite')).toThrowError();
      });

      it('should return a format error when `length` is < 0', () => {
        expect(() => estimator.tunnel(-10, 2, 'granite')).toThrowError();
      });

      it('should return a format error when `days` is < 0', () => {
        expect(() => estimator.tunnel(29, -10, 'granite')).toThrowError();
      });
    });
  });
});
