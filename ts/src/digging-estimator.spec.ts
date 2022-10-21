import {
  DiggingEstimator,
  InvalidFormatException,
  TunnelTooLongForDelayException,
} from './digging-estimator';

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

  it('should return 9 dwarf when minimal team can do in one day', () => {
    // To have it work, you need to go set the rates to [0, 3, 5.5, 7]
    const result = estimator.tunnel(3, 1, 'granite');

    expect(result.total).toBe(9);
  });

  describe('should throw an exception', () => {
    describe('InvalidFormatException', () => {
      let expectedError: InvalidFormatException;

      beforeEach(() => {
        expectedError = new InvalidFormatException();
      });

      it('should return a format error when `length` is invalid', () => {
        expect(() => estimator.tunnel(NaN, 2, 'granite')).toThrow(
          expectedError,
        );
      });

      it('should return a format error when `days` is invalid', () => {
        expect(() => estimator.tunnel(28, NaN, 'granite')).toThrow(
          expectedError,
        );
      });

      it('should return a format error when `length` is < 0', () => {
        expect(() => estimator.tunnel(-10, 2, 'granite')).toThrow(
          expectedError,
        );
      });

      it('should return a format error when `days` is < 0', () => {
        expect(() => estimator.tunnel(29, -10, 'granite')).toThrow(
          expectedError,
        );
      });
    });

    describe('TunnelTooLongForDelayException', () => {
      it('should return too long error when there are no enough days', () => {
        expect(() => estimator.tunnel(28, 1, 'granite')).toThrow(
          new TunnelTooLongForDelayException(),
        );
      });
    });
  });
});
