import { DiggingEstimator } from './digging-estimator';
import {
  InvalidFormatException,
  TunnelTooLongForDelayException,
} from './error';
import { Role } from './team';

class FakeDiggingEstimator extends DiggingEstimator {
  private gobelins = false;

  protected getRotationMeters() {
    return [0, 3, 5.5, 7];
  }

  protected checkGobelins(): boolean {
    return this.gobelins;
  }

  public setGobelins(newValue: boolean) {
    this.gobelins = newValue;
  }
}

describe('Digging Estimator', () => {
  let estimator: FakeDiggingEstimator;

  beforeEach(() => {
    estimator = new FakeDiggingEstimator();
  });

  it('should return as Dr Pockovsky said', () => {
    // To have it work, you need to go set the rates to [0, 3, 5.5, 7]
    const result = estimator.tunnel(28, 2, 'granite', 'bordeaux');

    expect(result.getTotal()).toBe(48);
  });

  describe('Day Team', () => {
    const dayTeamExpected: Record<Role, number> = {
      [Role.Miners]: 3,
      [Role.Healers]: 1,
      [Role.Smithies]: 2,
      [Role.Lighters]: 0,
      [Role.InnKeepers]: 8,
      [Role.Guards]: 0,
      [Role.GuardManagers]: 0,
      [Role.Washers]: 2,
      [Role.Protectors]: 0,
    };

    it.each(
      Object.entries(dayTeamExpected).map(([role, expected]) => ({
        role,
        expected,
      })),
    )('should have $expected $role', ({ role, expected }) => {
      const result = estimator.tunnel(28, 2, 'granite', 'bordeaux');

      expect(result.getDayTeam()[role as Role]).toBe(expected);
    });
  });

  describe('Night Team', () => {
    const nightTeamExpected: Record<Role, number> = {
      [Role.Miners]: 3,
      [Role.Healers]: 1,
      [Role.Smithies]: 2,
      [Role.Lighters]: 4,
      [Role.InnKeepers]: 12,
      [Role.Guards]: 5,
      [Role.GuardManagers]: 2,
      [Role.Washers]: 3,
      [Role.Protectors]: 0,
    };

    it.each(
      Object.entries(nightTeamExpected).map(([role, expected]) => ({
        role,
        expected,
      })),
    )('should have $expected $role', ({ role, expected }) => {
      const result = estimator.tunnel(28, 2, 'granite', 'bordeaux');

      expect(result.getNightTeam()[role as Role]).toBe(expected);
    });
  });

  describe('Gobelins', () => {
    it('should return as Dr Pockovsky said', () => {
      estimator.setGobelins(true);
      const result = estimator.tunnel(28, 2, 'granite', 'bordeaux');

      expect(result.getTotal()).toBe(60);
    });

    describe('Day Team', () => {
      const dayTeamExpected: Record<Role, number> = {
        [Role.Miners]: 3,
        [Role.Healers]: 1,
        [Role.Smithies]: 2,
        [Role.Lighters]: 0,
        [Role.InnKeepers]: 8,
        [Role.Guards]: 0,
        [Role.GuardManagers]: 0,
        [Role.Washers]: 2,
        [Role.Protectors]: 2,
      };

      it.each(
        Object.entries(dayTeamExpected).map(([role, expected]) => ({
          role,
          expected,
        })),
      )('should have $expected $role', ({ role, expected }) => {
        estimator.setGobelins(true);
        const result = estimator.tunnel(28, 2, 'granite', 'bordeaux');

        expect(result.getDayTeam()[role as Role]).toBe(expected);
      });
    });

    describe('Night Team', () => {
      const nightTeamExpected: Record<Role, number> = {
        [Role.Miners]: 3,
        [Role.Healers]: 1,
        [Role.Smithies]: 2,
        [Role.Lighters]: 6,
        [Role.InnKeepers]: 16,
        [Role.Guards]: 6,
        [Role.GuardManagers]: 2,
        [Role.Washers]: 4,
        [Role.Protectors]: 2,
      };

      it.each(
        Object.entries(nightTeamExpected).map(([role, expected]) => ({
          role,
          expected,
        })),
      )('should have $expected $role', ({ role, expected }) => {
        estimator.setGobelins(true);
        const result = estimator.tunnel(28, 2, 'granite', 'bordeaux');

        expect(result.getNightTeam()[role as Role]).toBe(expected);
      });
    });
  });

  describe('should throw an exception', () => {
    describe('InvalidFormatException', () => {
      let expectedError: InvalidFormatException;

      beforeEach(() => {
        expectedError = new InvalidFormatException();
      });

      it('should return a format error when `length` is invalid', () => {
        expect(() => estimator.tunnel(NaN, 2, 'granite', 'bordeaux')).toThrow(
          expectedError,
        );
      });

      it('should return a format error when `days` is invalid', () => {
        expect(() => estimator.tunnel(28, NaN, 'granite', 'bordeaux')).toThrow(
          expectedError,
        );
      });

      it('should return a format error when `length` is < 0', () => {
        expect(() => estimator.tunnel(-10, 2, 'granite', 'bordeaux')).toThrow(
          expectedError,
        );
      });

      it('should return a format error when `days` is < 0', () => {
        expect(() => estimator.tunnel(29, -10, 'granite', 'bordeaux')).toThrow(
          expectedError,
        );
      });
    });

    describe('TunnelTooLongForDelayException', () => {
      it('should return too long error when there are no enough days', () => {
        expect(() => estimator.tunnel(28, 1, 'granite', 'bordeaux')).toThrow(
          new TunnelTooLongForDelayException(),
        );
      });
    });
  });
});
