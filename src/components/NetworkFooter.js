import React from "react";
import "./NetworkFooter.css";

import { adapters } from "bidi-har-export";

class NetworkFooter extends React.Component {
  #onHarButtonClick = (events) => {
    const exporter = new adapters.EventsCollectionExporter(events, {
      browser: "Firefox",
      version: "111.0a1",
    });
    const har = exporter.exportAsHar();

    const blob = new Blob([JSON.stringify(har, null, 2)], {
      type: "application/json",
    });

    // Create a fake download link and trigger the download.
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `bidi-har-${new Date().toISOString()}.har`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  render() {
    const {
      filteredHarEvents,
      filteredNetworkEntries,
      filteredPageTimings,
    } = this.props;


    return (
      <div className="network-footer">
        <span className="network-summary-item">
          {filteredNetworkEntries.length} requests
        </span>
        <span className="network-summary-item network-summary-timing">
          DOMContentLoaded: {filteredPageTimings.findLast(t => t.type === "domContentLoaded")?.relativeTime}ms
        </span>
        <span className="network-summary-item network-summary-timing">
          load: {filteredPageTimings.findLast(t => t.type === "load")?.relativeTime}ms
        </span>
        <span
          className="network-summary-item network-har-export-button"
          onClick={() => this.#onHarButtonClick(filteredHarEvents)}
        >
          Save all as HAR
        </span>
      </div>
    );
  }
}

export default NetworkFooter;