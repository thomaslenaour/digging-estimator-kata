import {
  InvalidFormatException,
  TunnelTooLongForDelayException,
} from './error';
import { DayTeam, NightTeam, TeamComposition } from './team';

const ROTATION_DURATION_HOURS = 12;
const DAY_DURATION_HOURS = 24;

export class DiggingEstimator {
  tunnel(length: number, days: number, rockType: string): TeamComposition {
    this.checkFormat(length, days);

    const dailyMaxPossibleMeters = Math.floor(length / days);
    const digPerRotation = this.getRotationMeters(rockType);
    const maxDigPerRotation = digPerRotation[digPerRotation.length - 1];
    const maxDigPerDay =
      (DAY_DURATION_HOURS / ROTATION_DURATION_HOURS) * maxDigPerRotation;
    const nightTeamRequired = dailyMaxPossibleMeters > maxDigPerRotation;
    const nbMinersByTeam = digPerRotation.length - 1;

    if (dailyMaxPossibleMeters > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }

    const dayTeam = new DayTeam(nbMinersByTeam);
    const nightTeam = nightTeamRequired
      ? new NightTeam(nbMinersByTeam)
      : new NightTeam(0);

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
