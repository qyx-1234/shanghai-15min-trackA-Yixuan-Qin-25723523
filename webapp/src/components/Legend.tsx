import { useMemo } from 'react';

interface LegendProps {
  minScore: number;
  maxScore: number;
}

export default function Legend({ minScore, maxScore }: LegendProps) {
  const gradientStops = useMemo(() => {
    const stops: { color: string; position: number }[] = [];
    const colors = [
      [34, 94, 168],
      [43, 140, 190],
      [116, 196, 118],
      [254, 217, 118],
      [253, 141, 60],
      [215, 48, 39],
    ];
    for (let i = 0; i < colors.length; i++) {
      stops.push({
        color: `rgb(${colors[i][0]},${colors[i][1]},${colors[i][2]})`,
        position: i / (colors.length - 1) * 100,
      });
    }
    return stops;
  }, []);

  const gradientCSS = gradientStops
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-gray-900/90 backdrop-blur rounded-lg p-3 shadow-xl">
      <div className="text-xs text-gray-400 mb-1 text-center">Score</div>
      <div
        className="w-6 h-40 rounded"
        style={{ background: `linear-gradient(to bottom, ${gradientCSS})` }}
      />
      <div className="flex flex-col justify-between h-40 -mt-40">
        <span className="text-xs text-white text-right -mr-7">{maxScore.toFixed(2)}</span>
        <span className="text-xs text-white text-right -mr-7">{minScore.toFixed(2)}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1 text-center">
        Low → High
      </div>
    </div>
  );
}
