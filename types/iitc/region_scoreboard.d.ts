export { };

declare global {
  class RegionScoreboard_ {
    HistoryChart: HistoryChart_;
    setup(): void;
    showDialog(): void;
  }

  class HistoryChart_ {
    create(_regionScore: RegionScoreboard_, logscale: boolean): void;
  }

  var RegionScoreboard: RegionScoreboard_;
}
