import {
  InvalidFormatException,
  TunnelTooLongForDelayException,
} from './error';
import { DayTeam, NightTeam, Role, TeamComposition } from './team';

export class DiggingEstimator {
  tunnel(length: number, days: number, rockType: string): TeamComposition {
    this.checkFormat(length, days);

    const maxPossibleMeters = Math.floor(length / days);
    const digPerRotation = this.getRotationMeters(rockType);
    const maxDigPerRotation = digPerRotation[digPerRotation.length - 1];
    const maxDigPerDay = 2 * maxDigPerRotation;
    const nightTeamRequired = maxPossibleMeters > maxDigPerRotation;
    const nbMinersByTeam = digPerRotation.length - 1;

    if (maxPossibleMeters > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }

    const dayTeam = new DayTeam(nbMinersByTeam);
    const nightTeam = nightTeamRequired
      ? new NightTeam(nbMinersByTeam)
      : new NightTeam(0);

    if (nightTeamRequired) {
      const nightTeamComposition = nightTeam.getComposition();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const oldWashers = nightTeam.getRole(Role.Washers);
        const oldGuard = nightTeam.getRole(Role.Guards);
        const oldChiefGuard = nightTeam.getRole(Role.GuardManagers);

        nightTeam.updateRole(
          Role.Washers,
          Math.ceil(
            (nightTeamComposition.Miners +
              nightTeamComposition.Healers +
              nightTeamComposition.Smithies +
              nightTeamComposition.InnKeepers +
              nightTeamComposition.Lighters +
              nightTeam.getRole(Role.Guards) +
              nightTeam.getRole(Role.GuardManagers)) /
              10,
          ),
        );

        nightTeam.updateRole(
          Role.Guards,
          Math.ceil(
            (nightTeamComposition.Healers +
              nightTeamComposition.Miners +
              nightTeamComposition.Smithies +
              nightTeamComposition.Lighters +
              nightTeam.getRole(Role.Washers)) /
              3,
          ),
        );

        nightTeam.updateRole(
          Role.GuardManagers,
          Math.ceil(nightTeam.getRole(Role.Guards) / 3),
        );

        if (
          oldWashers === nightTeam.getRole(Role.Washers) &&
          oldGuard === nightTeam.getRole(Role.Guards) &&
          oldChiefGuard === nightTeam.getRole(Role.GuardManagers)
        ) {
          break;
        }
      }
    }

    const composition = new TeamComposition(dayTeam, nightTeam);
    composition.calculateTotal();

    return composition;
  }

  private checkFormat(length: number, days: number) {
    if (
      Math.floor(length) !== length ||
      Math.floor(days) !== days ||
      length < 0 ||
      days < 0
    ) {
      throw new InvalidFormatException();
    }
  }

  protected getRotationMeters(rockType: string): number[] {
    // For example, for granite it returns [0, 3, 5.5, 7]
    // if you put 0 dwarf, you dig 0m/d/team
    // if you put 1 dwarf, you dig 3m/d/team
    // 2 dwarves = 5.5m/d/team
    // so a day team on 2 miners and a night team of 1 miner dig 8.5m/d
    const url = `dtp://research.vin.co/digging-rate/${rockType}`;
    console.log(`Tried to fetch ${url}`);
    throw new Error('Does not work in test mode');
  }
}
