'use client'
import { useMemo } from "react";
import { useWindowDimensions } from "@/common/hooks/useWindowDimensions";
import { abbreviateNumberWithoutDecimals } from "@/utils/helpers";
import { Serie } from "@nivo/line";
import dynamic from "next/dynamic";

const ResponsiveLine = dynamic(() => import("@nivo/line").then(m => m.ResponsiveLine), { ssr: false });

export const Chart = ({
  chartData,
} : {
  chartData: Serie[];
}) => {
  const {
    windowSize,
  } = useWindowDimensions()
  const processedData = useMemo(() => {
    if (!chartData?.length || !chartData[0]?.data?.length) {
      return chartData;
    }
    const uniquePoints = chartData[0].data.reduce((acc, point) => {
      const existing = acc[String(point.x)];
      if (!existing || (existing.y ?? -Infinity) < (point.y ?? -Infinity)) {
        acc[String(point.x)] = point;
      }
      return acc;
    }, {} as Record<string, typeof chartData[0]['data'][0]>);

    const sortedData = Object.values(uniquePoints)
      .sort((a, b) => new Date(a.x ?? "").getTime() - new Date(b.x ?? "").getTime());

    const yValues = sortedData.map(d => Number(d.y) ?? 0).sort((a, b) => (a ?? 0) - (b ?? 0));
    const q1Index = Math.floor(yValues.length * 0.25);
    const q3Index = Math.floor(yValues.length * 0.75);
    const q1 = yValues[q1Index];
    const q3 = yValues[q3Index];
    const iqr = q3 - q1;
    const upperBound = q3 + (iqr * 1.5);
    const lowerBound = q1 - (iqr * 1.5);

    const cleanedData = sortedData.filter(d => {
      const yValue = Number(d.y);
      return !isNaN(yValue) && yValue >= lowerBound && yValue <= upperBound;
    });

    return [{
      ...chartData[0],
      data: cleanedData,
    }];
  }, [chartData]);
  const CustomPointSymbol = () => {
    return (
      <g>
        <circle
          cx="0"
          cy="0"
          r="4"
          fill="#FFFFFF"
          stroke="#8557D4"
          strokeWidth="1" />
        <circle  cx="0"
          cy="0"
          r="6"
          fill="none"
          stroke="#8557D4"
          strokeOpacity="0.4"
          strokeWidth="6"/>
      </g>
    );
  };
  const formatYAxisTick = (value: number) => {
    return (abbreviateNumberWithoutDecimals(value.toString()) || 0).toString()
  };
  return (
    <div className="h-[260px] md:h-[500px] w-full overflow-hidden md:overflow-visible">
      <ResponsiveLine
        data={processedData}
        margin={{
          top: windowSize === "mobile" ? 10 : 40,
          right: windowSize === "mobile" ? 10 : 40,
          bottom: windowSize === "mobile" ? 10 : 60,
          left: windowSize === "mobile" ? 50 : 80,
        }}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          precision: 'second',
        }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false,
        }}
        tooltip={point => {
          return (
            <div className="bg-white/5 backdrop-blur-sm p-1 px-2 border-white/5 border-b rounded-lg">
              <div
                className="
                  font-semibold text-xs
                  bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                  bg-clip-text
                  text-transparent
                  animate-animatedText
              "
              >
                {abbreviateNumberWithoutDecimals(point.point.data.yFormatted.toString())}
              </div>
            </div>
          );
        }}
        xFormat="time:%Y-%m-%d"
        theme={{
          text: {
            fontFamily: "inherit",
            fontSize: "12",
          },
          axis: {
            legend: {
              text: {
                fill: '#7E5EF2',
                fontWeight: '500',
                fontSize: 14,
              },
            },
            ticks: {
              text: {
                fontSize: "12",
                fontWeight: "400",
                fill: '#5a4f81',
              },
            },
          },
        }}
        curve="monotoneX"
        enableArea={true}
        enableGridX={false}
        enableGridY={false}
        enablePoints={true}
        axisTop={null}
        axisRight={null}
        yFormat=" >-.2f"
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
          legendPosition: 'middle',
          truncateTickAt: 10,
          legend: "Tokens",
          format: formatYAxisTick,
          legendOffset: -60,
        }}
        axisBottom={windowSize === "mobile" ? null : {
          format: '%d %b %y',
        }}
        pointSymbol={CustomPointSymbol}
        areaBlendMode="multiply"
        areaOpacity={0.1}
        colors="#7E5EF2"
        pointSize={10}
        pointColor={{ from: 'color' }}
        pointBorderWidth={0}
        role="application"
        enableTouchCrosshair={true}
        useMesh={true}
      />
    </div>
  )
}
