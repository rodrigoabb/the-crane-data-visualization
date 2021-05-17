import React from 'react';
import { Group } from '@vx/group';
import { BarGroup } from '@vx/shape';
import { SeriesPoint } from '@vx/shape/lib/types';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip';

import { sortArrayByKey, capitalizeFirstLeter } from '../../../common/utils/helperFunctions';

import './bar-chart.component.scss';

export type BarGroupProps = {
  width: number;
  height: number;
  showLeftAxis?: boolean;
  data: Array<any>;
  keys: Array<string>;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  backgroundColor?: string;
  colours: Array<string>;
  nonValueAttributes: Array<string>;
};

export const green = '#e5fd3d';
// export const background = '#612efb';
const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

const BarChart: React.FC<BarGroupProps> = ({
  width,
  height,
  data,
  keys,
  events = false,
  margin = defaultMargin,
  showLeftAxis = false,
  colours,
  backgroundColor = '#612efb',
  nonValueAttributes,
}: BarGroupProps) => {

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

// accessors
const getNominalValue = (d: any) => d.groupedBy;

// scales
const nominalAxisScale = scaleBand<string>({
  domain: data.map(getNominalValue),
  padding: 0.01,
});
const valueKeysScale = scaleBand<string>({
  domain: keys,
  padding: 0.1,
});


const maxValue = Math.max(...data.map(d => Math.max(...Object.keys(d).map(key => {
  if (nonValueAttributes && !nonValueAttributes.includes(key)) {
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

  // const yScale = scaleLinear({
  //   rangeRound: [0, yMax],
  //   domain: [Math.max(...data.map(y)), 0],
  // });

  // update scale output dimensions
  nominalAxisScale.rangeRound([0, xMax]);
  valueKeysScale.rangeRound([0, nominalAxisScale.bandwidth()]);
  ordinalAxisScale.range([yMax, 0]);

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  return width < 10 ? null : (
    // relative position is needed for correct tooltip positioning
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={backgroundColor} rx={14} />
        <Group top={margin.top} left={margin.left}>
          <BarGroup
            data={data}
            keys={keys}
            height={yMax}
            x0={getNominalValue}
            x0Scale={nominalAxisScale}
            x1Scale={valueKeysScale}
            yScale={ordinalAxisScale}
            color={colorScale}
          >
            {barGroups =>
            {
              return barGroups.map(barGroup => {
                barGroup.bars = sortArrayByKey(barGroup.bars.filter((obj) => obj.value !== undefined), 'value', 'desc');
                return (
                  <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                  {
                    barGroup.bars.map((bar: any, idx) => {
                        bar.width = 16;
                        if (barGroup.bars.length === 1) {
                          bar.x = 10 + 15
                        } else {
                          bar.x = 10 + bar.width * idx;
                        }
                        return (
                          <rect
                            key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
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
                              const top = event.clientY;
                              const left = barGroup.x0;
                              showTooltip({
                                tooltipData: bar,
                                tooltipTop: top,
                                tooltipLeft: left,
                              });
                            }}
                          />
                        )
                      // }
                    })
                  }
                </Group>
              )})

            }
            }
          </BarGroup>
        </Group>

        {
          showLeftAxis &&
          <AxisLeft
            axisClassName="left-axis"
            scale={ordinalAxisScale}
            top={margin.top}
            left={25}
            label={'Value'}
            stroke={'#1b1a1e'}
            tickLabelProps={(value, index) => ({
              fontSize: 11,
              textAnchor: 'end',
            })}
            />
        }

        <AxisBottom
          top={yMax + margin.top}
          left={ margin.left }
          scale={nominalAxisScale}
          // stroke={green}
          // tickStroke={green}
          hideTicks={true}
          hideAxisLine
          tickLabelProps={() => ({
            fill: green,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
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
}

export default BarChart;
