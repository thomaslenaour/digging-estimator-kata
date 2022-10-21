export class TunnelTooLongForDelayException extends Error {}

export class InvalidFormatException extends Error {}

export class Team {
  miners = 0;
  healers = 0;
  smithies = 0;
  lighters = 0;
  innKeepers = 0;
  guards = 0;
  guardManagers = 0;
  washers = 0;
}

export class TeamComposition {
  dayTeam: Team = new Team();
  nightTeam: Team = new Team();

  total = 0;
}

export class DiggingEstimator {
  tunnel(length: number, days: number, rockType: string): TeamComposition {
    if (
      Math.floor(length) !== length ||
      Math.floor(days) !== days ||
      length < 0 ||
      days < 0
    ) {
      throw new InvalidFormatException();
    }

    const maxPossibleMeters = Math.floor(length / days);

    const digPerRotation = this.getDayMeters(rockType);
    const maxDigPerRotation = digPerRotation[digPerRotation.length - 1];
    const maxDigPerDay = 2 * maxDigPerRotation;

    if (maxPossibleMeters > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }
    const composition = new TeamComposition();

    // Miners
    for (let i = 0; i < digPerRotation.length - 1; ++i) {
      if (digPerRotation[i] < maxPossibleMeters) {
        composition.dayTeam.miners++;
      }
    }
    if (maxPossibleMeters > maxDigPerRotation) {
      for (let i = 0; i < digPerRotation.length - 1; ++i) {
        if (digPerRotation[i] + maxDigPerRotation < maxPossibleMeters) {
          composition.nightTeam.miners++;
        }
      }
    }
    const dayTeam = composition.dayTeam;
    const nightTeam = composition.nightTeam;

    const dayTeamHasMiners = dayTeam.miners > 0;
    const nightTeamHasMiners = nightTeam.miners > 0;

    if (dayTeamHasMiners) {
      ++dayTeam.healers;
      ++dayTeam.smithies;
      ++dayTeam.smithies;
    }

    if (nightTeamHasMiners) {
      ++nightTeam.healers;
      ++nightTeam.smithies;
      ++nightTeam.smithies;
    }

    if (nightTeamHasMiners) {
      nightTeam.lighters = nightTeam.miners + 1;
    }

    if (dayTeamHasMiners) {
      dayTeam.innKeepers =
        Math.ceil((dayTeam.miners + dayTeam.healers + dayTeam.smithies) / 4) *
        4;
      dayTeam.washers = Math.ceil(
        (dayTeam.miners +
          dayTeam.healers +
          dayTeam.smithies +
          dayTeam.innKeepers) /
          10,
      );
    }

    if (nightTeamHasMiners) {
      nightTeam.innKeepers =
        Math.ceil(
          (nightTeam.miners +
            nightTeam.healers +
            nightTeam.smithies +
            nightTeam.lighters) /
            4,
        ) * 4;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const oldWashers = nightTeam.washers;
      const oldGuard = nightTeam.guards;
      const oldChiefGuard = nightTeam.guardManagers;

      nightTeam.washers = Math.ceil(
        (nightTeam.miners +
          nightTeam.healers +
          nightTeam.smithies +
          nightTeam.innKeepers +
          nightTeam.lighters +
          nightTeam.guards +
          nightTeam.guardManagers) /
          10,
      );
      nightTeam.guards = Math.ceil(
        (nightTeam.healers +
          nightTeam.miners +
          nightTeam.smithies +
          nightTeam.lighters +
          nightTeam.washers) /
          3,
      );
      nightTeam.guardManagers = Math.ceil(nightTeam.guards / 3);

      if (
        oldWashers === nightTeam.washers &&
        oldGuard === nightTeam.guards &&
        oldChiefGuard === nightTeam.guardManagers
      ) {
        break;
      }
    }

    composition.total =
      dayTeam.miners +
      dayTeam.washers +
      dayTeam.healers +
      dayTeam.smithies +
      dayTeam.innKeepers +
      nightTeam.miners +
      nightTeam.washers +
      nightTeam.healers +
      nightTeam.smithies +
      nightTeam.innKeepers +
      nightTeam.guards +
      nightTeam.guardManagers +
      nightTeam.lighters;
    return composition;
  }

  protected getDayMeters(rockType: string): number[] {
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
