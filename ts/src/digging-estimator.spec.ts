import {
  DiggingEstimator,
  InvalidFormatException,
  TunnelTooLongForDelayException,
} from './digging-estimator';

class FakeDiggingEstimator extends DiggingEstimator {
  getDayMeters() {
    console.log('trigger');
    return [0, 3, 5.5, 7];
  }
}

describe('digging estimator', () => {
  let estimator: DiggingEstimator;

  beforeEach(() => {
    estimator = new FakeDiggingEstimator();
  });

  it('should return as Dr Pockovsky said', () => {
    // To have it work, you need to go set the rates to [0, 3, 5.5, 7]
    const result = estimator.tunnel(28, 2, 'granite');

    expect(result.total).toBe(48);
  });

  describe('day team', () => {
    it('should have 3 miners', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.miners).toBe(3);
    });

    it('should have 2 smithies', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.smithies).toBe(2);
    });

    it('should have 1 healer', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.healers).toBe(1);
    });

    it('should not have lighter', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.lighters).toBe(0);
    });

    it('should have 8 innkeepers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.innKeepers).toBe(8);
    });

    it('should have 0 guards', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.guards).toBe(0);
    });

    it('should have 0 guardManagers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.guardManagers).toBe(0);
    });

    it('should have 2 washers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.dayTeam.washers).toBe(2);
    });
  });

  describe('night team', () => {
    it('should have 3 miners', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.miners).toBe(3);
    });

    it('should have 2 smithies', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.smithies).toBe(2);
    });

    it('should have 1 healer', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.healers).toBe(1);
    });

    it('should have 4 ligthers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.lighters).toBe(4);
    });

    it('should have 12 innkeepers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.innKeepers).toBe(12);
    });

    it('should have 5 guards', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.guards).toBe(5);
    });

    it('should have 2 guardManagers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.guardManagers).toBe(2);
    });

    it('should have 3 washers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.nightTeam.washers).toBe(3);
    });
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
