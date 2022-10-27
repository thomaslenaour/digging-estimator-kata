import { Team, Role } from './team';

const WASHERS_SLICE_FOR_TEN_DWARFS = 10;
const GUARDS_SLICE_FOR_THREE_DWARFS = 3;
const GUARDS_MANAGER_SLICE_FOR_THREE_GUARDS = 3;

export class NightTeam extends Team {
  constructor(nbOfMiners: number) {
    super(nbOfMiners);
    if (nbOfMiners > 0) {
      this.init();
    }
  }

  private init() {
    this.calculateHealers();
    this.calculateSmithies();
    this.calculateLighters();
    this.calculateInnKeepers();
    this.calculateGuardsAndWashers();
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

  private getGuardsAndInKeepers() {
    return (
      this.getRole(Role.Guards) +
      this.getRole(Role.GuardManagers) +
      this.getRole(Role.InnKeepers)
    );
  }

  private calculateGuardsAndWashers() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const oldWashers = this.getRole(Role.Washers);
      const oldGuard = this.getRole(Role.Guards);
      const oldChiefGuard = this.getRole(Role.GuardManagers);

      this.updateRole(
        Role.Washers,
        (this.getTotal() - this.getRole(Role.Washers)) /
          WASHERS_SLICE_FOR_TEN_DWARFS,
      );

      this.updateRole(
        Role.Guards,
        (this.getTotal() - this.getGuardsAndInKeepers()) /
          GUARDS_SLICE_FOR_THREE_DWARFS,
      );

      this.updateRole(
        Role.GuardManagers,
        this.getRole(Role.Guards) / GUARDS_MANAGER_SLICE_FOR_THREE_GUARDS,
      );

      if (
        oldWashers === this.getRole(Role.Washers) &&
        oldGuard === this.getRole(Role.Guards) &&
        oldChiefGuard === this.getRole(Role.GuardManagers)
      ) {
        break;
      }
    }
  }
}
