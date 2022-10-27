export class TunnelTooLongForDelayException extends Error {}

export class InvalidFormatException extends Error {}
interface TeamRole {
  miners: number;
  healers: number;
  smithies: number;
  lighters: number;
  innKeepers: number;
  guards: number;
  guardManagers: number;
  washers: number;
}

interface ITeam {
  incrementRole(role: keyof TeamRole, nb: number): void;
  getRole(role: keyof TeamRole): number;
}

class Team implements TeamRole, ITeam {
  public miners = 0;
  public healers = 0;
  public smithies = 0;
  public lighters = 0;
  public innKeepers = 0;
  public guards = 0;
  public guardManagers = 0;
  public washers = 0;

  public incrementRole(role: keyof TeamRole, nb: number) {
    this[role] = this[role] + nb;
  }

  public updateRole(role: keyof TeamRole, nb: number) {
    this[role] = nb;
  }

  public getRole(role: keyof TeamRole) {
    return this[role];
  }
}

class DayTeam extends Team {}

class NightTeam extends Team {}

export class TeamComposition {
  private total = 0;

  constructor(
    private readonly dayTeam: DayTeam,
    private readonly nightTeam: NightTeam,
  ) {}

  public calculateTotal() {
    this.total =
      this.dayTeam.getRole('miners') +
      this.dayTeam.getRole('washers') +
      this.dayTeam.getRole('healers') +
      this.dayTeam.getRole('smithies') +
      this.dayTeam.getRole('innKeepers') +
      this.nightTeam.getRole('miners') +
      this.nightTeam.getRole('washers') +
      this.nightTeam.getRole('healers') +
      this.nightTeam.getRole('smithies') +
      this.nightTeam.getRole('innKeepers') +
      this.nightTeam.getRole('guards') +
      this.nightTeam.getRole('guardManagers') +
      this.nightTeam.getRole('lighters');
  }

  public getTotal() {
    return this.total;
  }

  public getDayTeam() {
    return this.dayTeam;
  }

  public getNightTeam() {
    return this.nightTeam;
  }
}

export class DiggingEstimator {
  tunnel(length: number, days: number, rockType: string): TeamComposition {
    this.checkFormat(length, days);

    const maxPossibleMeters = Math.floor(length / days);
    const digPerRotation = this.getRotationMeters(rockType);
    const maxDigPerRotation = digPerRotation[digPerRotation.length - 1];
    const maxDigPerDay = 2 * maxDigPerRotation;

    if (maxPossibleMeters > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }

    // const composition = new TeamComposition();
    const dayTeam = new DayTeam();
    const nightTeam = new DayTeam();

    // Miners
    for (let i = 0; i < digPerRotation.length - 1; ++i) {
      if (digPerRotation[i] < maxPossibleMeters) {
        dayTeam.incrementRole('miners', 1);
      }
    }
    if (maxPossibleMeters > maxDigPerRotation) {
      for (let i = 0; i < digPerRotation.length - 1; ++i) {
        if (digPerRotation[i] + maxDigPerRotation < maxPossibleMeters) {
          nightTeam.incrementRole('miners', 1);
        }
      }
    }

    const dayTeamHasMiners = dayTeam.getRole('miners') > 0;
    const nightTeamHasMiners = nightTeam.getRole('miners') > 0;

    if (dayTeamHasMiners) {
      dayTeam.incrementRole('healers', 1);
      dayTeam.incrementRole('smithies', 2);
      dayTeam.incrementRole(
        'innKeepers',
        Math.ceil(
          (dayTeam.getRole('miners') +
            dayTeam.getRole('healers') +
            dayTeam.getRole('smithies')) /
            4,
        ) * 4,
      );
      dayTeam.incrementRole(
        'washers',
        Math.ceil(
          (dayTeam.getRole('miners') +
            dayTeam.getRole('healers') +
            dayTeam.getRole('smithies') +
            dayTeam.getRole('innKeepers')) /
            10,
        ),
      );
    }

    if (nightTeamHasMiners) {
      nightTeam.incrementRole('healers', 1);
      nightTeam.incrementRole('smithies', 2);
      nightTeam.incrementRole('lighters', nightTeam.getRole('miners') + 1);
      nightTeam.incrementRole(
        'innKeepers',
        Math.ceil(
          (nightTeam.getRole('miners') +
            nightTeam.getRole('healers') +
            nightTeam.getRole('smithies') +
            nightTeam.getRole('lighters')) /
            4,
        ) * 4,
      );
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const oldWashers = nightTeam.getRole('washers');
      const oldGuard = nightTeam.getRole('guards');
      const oldChiefGuard = nightTeam.getRole('guardManagers');

      nightTeam.updateRole(
        'washers',
        Math.ceil(
          (nightTeam.getRole('miners') +
            nightTeam.getRole('healers') +
            nightTeam.getRole('smithies') +
            nightTeam.getRole('innKeepers') +
            nightTeam.getRole('lighters') +
            nightTeam.getRole('guards') +
            nightTeam.getRole('guardManagers')) /
            10,
        ),
      );

      nightTeam.updateRole(
        'guards',
        Math.ceil(
          (nightTeam.getRole('healers') +
            nightTeam.getRole('miners') +
            nightTeam.getRole('smithies') +
            nightTeam.getRole('lighters') +
            nightTeam.getRole('washers')) /
            3,
        ),
      );

      nightTeam.updateRole(
        'guardManagers',
        Math.ceil(nightTeam.getRole('guards') / 3),
      );

      if (
        oldWashers === nightTeam.getRole('washers') &&
        oldGuard === nightTeam.getRole('guards') &&
        oldChiefGuard === nightTeam.getRole('guardManagers')
      ) {
        break;
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
