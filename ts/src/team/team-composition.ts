import { DayTeam } from './day-team';
import { NightTeam } from './night-team';

export class TeamComposition {
  private total = 0;

  constructor(
    private readonly dayTeam: DayTeam,
    private readonly nightTeam: NightTeam,
  ) {}

  public calculateTotal() {
    this.total = this.dayTeam.getTotal() + this.nightTeam.getTotal();
  }

  public getTotal() {
    return this.total;
  }

  public getDayTeam() {
    return this.dayTeam.getComposition();
  }

  public getNightTeam() {
    return this.nightTeam.getComposition();
  }
}
