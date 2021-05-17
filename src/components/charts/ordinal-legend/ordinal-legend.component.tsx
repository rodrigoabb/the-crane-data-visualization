import React from 'react';
import { scaleOrdinal } from '@vx/scale';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel,
} from '@vx/legend';

import './ordinal-legend.component.scss';

export type OrdinalLegendProps = {
  keys: Array<string>;
  colours: Array<string>;
  events?: boolean;
  title: string;
};

const legendGlyphSize = 15;

const OrdinalLegend: React.FC<OrdinalLegendProps> = ({
  title,
  colours,
  keys,
  events = false,
}: OrdinalLegendProps) => {

  const ordinalColorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: colours,
  });

  return (
    <div className="legend">
      <div className="title">
        {title}
      </div>
      <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label.toUpperCase()}`}>
        {labels => (
          <div className="legend-labels">
            {labels.map((label, i) => (
              <LegendItem
                key={`legend-quantile-${i}`}
                margin="0 5px"
                onClick={() => {
                  if (events) alert(`clicked: ${JSON.stringify(label)}`);
                }}
              >
                <svg width={legendGlyphSize} height={legendGlyphSize}>
                  <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                </svg>
                <LegendLabel align="left" margin="0 0 0 4px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))}
          </div>
        )}
      </LegendOrdinal>
    </div>
  );
}

export default OrdinalLegend;
