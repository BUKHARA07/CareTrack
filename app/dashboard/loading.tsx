export default function DashboardLoading() {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard content"
      className="mrmsLoading"
    >
      <header className="mrmsPageHeader mrmsLoadingHeader">
        <div className="mrmsSkGroup">
          <div className="mrmsSkLine mrmsSkTitle" />
          <div className="mrmsSkLine mrmsSkSubtitle" />
        </div>
        <div className="mrmsSkBtn mrmsSkBtnWide" />
      </header>

      <div className="mrmsFilters mrmsLoadingFilters">
        <div className="mrmsSkInput" />
        <div className="mrmsSkInput" />
        <div className="mrmsSkBtn" />
      </div>

      <section className="mrmsLoadingStats" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <article className="mrmsSkCard" key={index}>
            <div className="mrmsSkLine mrmsSkMini" />
            <div className="mrmsSkLine mrmsSkValue" />
            <div className="mrmsSkLine mrmsSkTiny" />
          </article>
        ))}
      </section>

      <section className="dashPanel">
        <div className="dashPanelHead mrmsLoadingPanelHead">
          <div className="mrmsSkLine mrmsSkPanelTitle" />
          <div className="mrmsSkBtn mrmsSkBtnSmall" />
        </div>
        <div className="mrmsLoadingRows">
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="mrmsSkRow" key={index}>
              <div className="mrmsSkDot" />
              <div className="mrmsSkGroup">
                <div className="mrmsSkLine mrmsSkCellLg" />
                <div className="mrmsSkLine mrmsSkCellSm" />
              </div>
              <div className="mrmsSkLine mrmsSkPill" />
              <div className="mrmsSkLine mrmsSkCell" />
              <div className="mrmsSkLine mrmsSkCell" />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
