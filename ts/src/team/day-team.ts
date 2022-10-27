import { Team, Role } from './team';

export class DayTeam extends Team {
  constructor(nbOfMiners: number) {
    super(nbOfMiners);
    this.init();
  }

  private init() {
    this.calculateHealers();
    this.calculateSmithies();
    this.calculateInnKeepers();
    this.calculateWashers();
  }

  protected calculateHealers(): void {
    this.incrementRole(Role.Healers, 1);
  }

  protected calculateSmithies(): void {
    this.incrementRole(Role.Smithies, 2);
  }

  protected calculateInnKeepers(): void {
    this.incrementRole(
      Role.InnKeepers,
      Math.ceil(
        (this.getRole(Role.Miners) +
          this.getRole(Role.Healers) +
          this.getRole(Role.Smithies)) /
          4,
      ) * 4,
    );
  }

  private calculateWashers(): void {
    this.incrementRole(
      Role.Washers,
      Math.ceil(
        (this.getRole(Role.Miners) +
          this.getRole(Role.Healers) +
          this.getRole(Role.Smithies) +
          this.getRole(Role.InnKeepers)) /
          10,
      ),
    );
  }
}
