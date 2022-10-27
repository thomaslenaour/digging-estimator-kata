import {
  DiggingEstimator,
  InvalidFormatException,
  Role,
  TunnelTooLongForDelayException,
} from './digging-estimator';

class FakeDiggingEstimator extends DiggingEstimator {
  getRotationMeters() {
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
    console.log('result', result);

    expect(result.getTotal()).toBe(48);
  });

  describe('day team', () => {
    it('should have 3 miners', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.Miners)).toBe(3);
    });

    it('should have 2 smithies', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.Smithies)).toBe(2);
    });

    it('should have 1 healer', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.Healers)).toBe(1);
    });

    it('should not have lighter', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.Lighters)).toBe(0);
    });

    it('should have 8 innkeepers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.InnKeepers)).toBe(8);
    });

    it('should have 0 guards', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.Guards)).toBe(0);
    });

    it('should have 0 guardManagers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.GuardManagers)).toBe(0);
    });

    it('should have 2 washers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getDayTeam().getRole(Role.Washers)).toBe(2);
    });
  });

  describe('night team', () => {
    it('should have 3 miners', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.Miners)).toBe(3);
    });

    it('should have 2 smithies', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.Smithies)).toBe(2);
    });

    it('should have 1 healer', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.Healers)).toBe(1);
    });

    it('should have 4 ligthers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.Lighters)).toBe(4);
    });

    it('should have 12 innkeepers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.InnKeepers)).toBe(12);
    });

    it('should have 5 guards', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.Guards)).toBe(5);
    });

    it('should have 2 guardManagers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.GuardManagers)).toBe(2);
    });

    it('should have 3 washers', () => {
      const result = estimator.tunnel(28, 2, 'granite');

      expect(result.getNightTeam().getRole(Role.Washers)).toBe(3);
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
