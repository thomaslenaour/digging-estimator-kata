import { Team, Role } from './team';

export class NightTeam extends Team {
  constructor(nbOfMiners: number) {
    super(nbOfMiners);
    this.init();
  }

  private init() {
    this.calculateHealers();
    this.calculateSmithies();
    this.calculateLighters();
    this.calculateInnKeepers();
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
          this.getRole(Role.Smithies) +
          this.getRole(Role.Lighters)) /
          4,
      ) * 4,
    );
  }

  private calculateLighters(): void {
    this.incrementRole(Role.Lighters, this.getRole(Role.Miners) + 1);
  }
}
