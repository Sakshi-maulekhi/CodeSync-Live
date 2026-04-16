import React, { useMemo } from "react";
import Tooltip from "@uiw/react-tooltip";
import HeatMap from "@uiw/react-heat-map";

const Heatmap = ({ heatmapData = {} }) => {

  const currentYear = new Date().getFullYear();

  // Convert backend heatmapData to library format
  const formattedData = useMemo(() => {
    if (!heatmapData) return [];

    // If backend sends Map
    if (heatmapData instanceof Map) {
      return Array.from(heatmapData.entries()).map(([key, value]) => ({
        date: key.replace(/-/g, "/"),
        count: value,
      }));
    }

    // If backend sends normal object
    return Object.keys(heatmapData).map((key) => ({
      date: key.replace(/-/g, "/"),
      count: heatmapData[key],
    }));
  }, [heatmapData]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[910px]">
        <HeatMap
          value={formattedData}
          startDate={new Date(`${currentYear}/01/01`)}
          endDate={new Date(`${currentYear}/12/31`)}
          rectSize={15}
          legendCellSize={15}
          style={{
            color: "white",
            width: "100%",
            minHeight: "180px",
            fontSize: "12px",
            "--rhm-rect": "#4a6283",
          }}
          rectRender={(props, data) => (
            <Tooltip placement="top" content={`Solved: ${data.count || 0}`}>
              <rect {...props} />
            </Tooltip>
          )}
        />
      </div>
    </div>
  );
};

export default Heatmap;