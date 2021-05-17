import React from 'react';
import { BarGroupHorizontal, Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { SeriesPoint } from '@vx/shape/lib/types';
import { AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip';

import { sortArrayByKey, capitalizeFirstLeter } from '../../../common/utils/helperFunctions';

import './horizontal-bar-chart.component.scss';

export type BarGroupHorizontalProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data: Array<any>;
  keys: Array<string>;
  events?: boolean;
  colours: Array<string>;
  backgroundColor?: string;
  nonValueAttributes: Array<string>;
};

export const green = '#e5fd3d';
// export const background = '#612efb';
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 50 };

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

const HorizontalBarChart: React.FC<BarGroupHorizontalProps> = ({
  width,
  height,
  margin = defaultMargin,
  events = false,
  keys,
  data,
  colours,
  backgroundColor = '#612efb',
  nonValueAttributes,
}: BarGroupHorizontalProps) => {

  type TooltipData = {
    bar: SeriesPoint<any>;
    key: string;
    index: number;
    height: number;
    width: number;
    x: number;
    y: number;
    color: string;
    value: number;
  };

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

const formatDate = (date: string) => (date);

// accessors
const getNominalValue = (d: any) => d.groupedBy;

// scales
const nominalAxisScale = scaleBand({
  domain: data.map(getNominalValue),
  padding: 0.1,
});

const valueKeysScale = scaleBand({
  domain: keys,
  padding: 0.1,
});

const maxValue = Math.max(...data.map(d => Math.max(...Object.keys(d).map(key => {
  if (nonValueAttributes && !nonValueAttributes.includes(key)) {
    // +1 for adding a bit of padding to long Y-axis labels
    return Number(d[key] + 1);
  }
  return 0;
}))));

const ordinalAxisScale = scaleLinear<number>({
  domain: [0, maxValue],
});

const colorScale = scaleOrdinal<string, string>({
  domain: keys,
  range: colours,
});

let tooltipTimeout: number;

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale output dimensions
  nominalAxisScale.rangeRound([0, yMax]);
  valueKeysScale.rangeRound([0, nominalAxisScale.bandwidth()]);
  ordinalAxisScale.rangeRound([0, xMax]);

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  return width < 10 ? null : (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={backgroundColor} rx={14} />
        <Group top={margin.top} left={margin.left}>
          <BarGroupHorizontal
            data={data}
            keys={keys}
            width={xMax}
            y0={getNominalValue}
            y0Scale={nominalAxisScale}
            y1Scale={valueKeysScale}
            xScale={ordinalAxisScale}
            color={colorScale}
          >
            {barGroups =>
            {
              return barGroups.map(barGroup => {
                barGroup.bars = sortArrayByKey(barGroup.bars.filter((obj) => obj.value !== undefined), 'value', 'desc');
                return (
                  <Group
                    key={`bar-group-horizontal-${barGroup.index}-${barGroup.y0}`}
                    top={barGroup.y0}
                  >
                    {barGroup.bars.map((bar: any, idx: number) => {
                      bar.height = 16;
                      bar.x = 40;
                      bar.y = 10 + bar.height * idx;
                      return (
                        <Bar
                          key={`${barGroup.index}-${bar.index}-${bar.key}`}
                          x={bar.x}
                          y={bar.y}
                          width={bar.width}
                          height={bar.height}
                          fill={bar.color}
                          rx={4}
                          onClick={() => {
                          }}
                          onMouseLeave={() => {
                            tooltipTimeout = window.setTimeout(() => {
                              hideTooltip();
                            }, 300);
                          }}
                          onMouseMove={(event) => {
                            if (tooltipTimeout) clearTimeout(tooltipTimeout);
                            const left = event.clientX;
                            const top = event.clientY;
                            showTooltip({
                              tooltipData: bar,
                              tooltipTop: top,
                              tooltipLeft: left,
                            });
                          }}
                        />
                      )
                    })}
                  </Group>
                )
              })

            }
            }
          </BarGroupHorizontal>
          <AxisLeft
            scale={nominalAxisScale}
            // stroke={green}
            // tickStroke={green}
            hideTicks={true}
            tickFormat={formatDate}
            hideAxisLine
            tickLabelProps={() => ({
              fill: green,
              fontSize: 11,
              textAnchor: 'middle',
              dy: '0.33em',
            })}
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
            <strong style={{ color: colorScale(tooltipData.key) }}>
              {`${capitalizeFirstLeter(tooltipData.key)}: `}
            </strong>
          <span>{ tooltipData.value }</span>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default HorizontalBarChart;
