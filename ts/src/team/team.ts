export enum Role {
  Miners = 'Miners',
  Healers = 'Healers',
  Smithies = 'Smithies',
  Lighters = 'Lighters',
  InnKeepers = 'InnKeepers',
  Guards = 'Guards',
  GuardManagers = 'GuardManagers',
  Washers = 'Washers',
  Protectors = 'Protectors',
}

export abstract class Team {
  private composition: Record<Role, number> = {
    [Role.Miners]: 0,
    [Role.Healers]: 0,
    [Role.Smithies]: 0,
    [Role.Lighters]: 0,
    [Role.InnKeepers]: 0,
    [Role.Guards]: 0,
    [Role.GuardManagers]: 0,
    [Role.Washers]: 0,
    [Role.Protectors]: 0,
  };

  constructor(nbOfMiners: number, gobelins: boolean) {
    this.incrementRole(Role.Miners, nbOfMiners);
    if (gobelins && nbOfMiners > 0) {
      this.incrementRole(Role.Protectors, 2);
    }
  }

  protected abstract calculateHealers(): void;

  protected abstract calculateSmithies(): void;

  protected abstract calculateInnKeepers(): void;

  public incrementRole(role: Role, nb: number) {
    this.composition[role] += nb;
  }

  public updateRole(role: Role, nb: number) {
    this.composition[role] = Math.ceil(nb);
  }

  public getRole(role: Role) {
    return this.composition[role];
  }

  public getComposition() {
    return this.composition;
  }

  public getTotal() {
    return Object.values(this.composition).reduce((acc, val) => acc + val, 0);
  }
}
