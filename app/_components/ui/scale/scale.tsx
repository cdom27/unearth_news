interface ScaleProps {
  value: number;
  scaleLabels: string[];
  colors: [string, string, string];
}

export default function Scale({ value, scaleLabels, colors }: ScaleProps) {
  const percentage = value * 100;
  const clamped = Math.min(100, Math.max(0, percentage));
  const [from, via, to] = colors;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between">
        {scaleLabels.map((label) => (
          <span key={label} className="text-sm text-clay-400 font-bold">
            {label.toLocaleUpperCase()}
          </span>
        ))}
      </div>

      <div
        className="relative h-1.5"
        style={{
          background: `linear-gradient(to right, var(--color-${from}), var(--color-${via}), var(--color-${to}))`,
        }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full bg-clay-100 border-[1.5px] border-clay-900"
          style={{ left: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
