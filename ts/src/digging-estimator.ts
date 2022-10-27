export class TunnelTooLongForDelayException extends Error {}

export class InvalidFormatException extends Error {}

export enum Role {
  Miners = 'Miners',
  Healers = 'Healers',
  Smithies = 'Smithies',
  Lighters = 'Lighters',
  InnKeepers = 'InnKeepers',
  Guards = 'Guards',
  GuardManagers = 'GuardManagers',
  Washers = 'Washers',
}

class Team {
  private composition: Record<Role, number> = {
    [Role.Miners]: 0,
    [Role.Healers]: 0,
    [Role.Smithies]: 0,
    [Role.Lighters]: 0,
    [Role.InnKeepers]: 0,
    [Role.Guards]: 0,
    [Role.GuardManagers]: 0,
    [Role.Washers]: 0,
  };

  public incrementRole(role: Role, nb: number) {
    this.composition[role] = this.composition[role] + nb;
  }

  public updateRole(role: Role, nb: number) {
    this.composition[role] = nb;
  }

  public getRole(role: Role) {
    return this.composition[role];
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
      this.dayTeam.getRole(Role.Miners) +
      this.dayTeam.getRole(Role.Washers) +
      this.dayTeam.getRole(Role.Healers) +
      this.dayTeam.getRole(Role.Smithies) +
      this.dayTeam.getRole(Role.InnKeepers) +
      this.nightTeam.getRole(Role.Miners) +
      this.nightTeam.getRole(Role.Washers) +
      this.nightTeam.getRole(Role.Healers) +
      this.nightTeam.getRole(Role.Smithies) +
      this.nightTeam.getRole(Role.InnKeepers) +
      this.nightTeam.getRole(Role.Guards) +
      this.nightTeam.getRole(Role.GuardManagers) +
      this.nightTeam.getRole(Role.Lighters);
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
        dayTeam.incrementRole(Role.Miners, 1);
      }
    }
    if (maxPossibleMeters > maxDigPerRotation) {
      for (let i = 0; i < digPerRotation.length - 1; ++i) {
        if (digPerRotation[i] + maxDigPerRotation < maxPossibleMeters) {
          nightTeam.incrementRole(Role.Miners, 1);
        }
      }
    }

    const dayTeamHasMiners = dayTeam.getRole(Role.Miners) > 0;
    const nightTeamHasMiners = nightTeam.getRole(Role.Miners) > 0;

    if (dayTeamHasMiners) {
      dayTeam.incrementRole(Role.Healers, 1);
      dayTeam.incrementRole(Role.Smithies, 2);
      dayTeam.incrementRole(
        Role.InnKeepers,
        Math.ceil(
          (dayTeam.getRole(Role.Miners) +
            dayTeam.getRole(Role.Healers) +
            dayTeam.getRole(Role.Smithies)) /
            4,
        ) * 4,
      );
      dayTeam.incrementRole(
        Role.Washers,
        Math.ceil(
          (dayTeam.getRole(Role.Miners) +
            dayTeam.getRole(Role.Healers) +
            dayTeam.getRole(Role.Smithies) +
            dayTeam.getRole(Role.InnKeepers)) /
            10,
        ),
      );
    }

    if (nightTeamHasMiners) {
      nightTeam.incrementRole(Role.Healers, 1);
      nightTeam.incrementRole(Role.Smithies, 2);
      nightTeam.incrementRole(
        Role.Lighters,
        nightTeam.getRole(Role.Miners) + 1,
      );
      nightTeam.incrementRole(
        Role.InnKeepers,
        Math.ceil(
          (nightTeam.getRole(Role.Miners) +
            nightTeam.getRole(Role.Healers) +
            nightTeam.getRole(Role.Smithies) +
            nightTeam.getRole(Role.Lighters)) /
            4,
        ) * 4,
      );
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const oldWashers = nightTeam.getRole(Role.Washers);
      const oldGuard = nightTeam.getRole(Role.Guards);
      const oldChiefGuard = nightTeam.getRole(Role.GuardManagers);

      nightTeam.updateRole(
        Role.Washers,
        Math.ceil(
          (nightTeam.getRole(Role.Miners) +
            nightTeam.getRole(Role.Healers) +
            nightTeam.getRole(Role.Smithies) +
            nightTeam.getRole(Role.InnKeepers) +
            nightTeam.getRole(Role.Lighters) +
            nightTeam.getRole(Role.Guards) +
            nightTeam.getRole(Role.GuardManagers)) /
            10,
        ),
      );

      nightTeam.updateRole(
        Role.Guards,
        Math.ceil(
          (nightTeam.getRole(Role.Healers) +
            nightTeam.getRole(Role.Miners) +
            nightTeam.getRole(Role.Smithies) +
            nightTeam.getRole(Role.Lighters) +
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
