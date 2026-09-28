import { useId } from "react";

const DARK = "#1f1f24";
const FRAME = "#2f2f35";

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

export const MONITOR_SIZES = {
  monitor24: { w: 112, h: 68 },
  monitor27: { w: 128, h: 78 },
  monitor34: { w: 236, h: 86 },
} as const;

export type MonitorId = keyof typeof MONITOR_SIZES;
export const MONITOR_NECK = 40;

/** Height from its base to the top of the bezel. */
export const monitorHeight = (id: MonitorId) =>
  MONITOR_NECK + MONITOR_SIZES[id].h;

function CodeScreen({ x, y, w, h }: Rect) {
  const lines = [0.55, 0.8, 0.4, 0.65, 0.3, 0.7, 0.5];
  const colors = ["#7dd3fc", "#f9a8d4", "#fde68a", "#86efac"];
  const rows = Math.floor((h - 10) / 8);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill="#1e2430" />
      <rect x={x} y={y} width={w * 0.18} height={h} rx={2} fill="#262e3d" />
      {Array.from({ length: rows }, (_, i) => (
        <rect
          key={i}
          x={x + w * 0.22 + (i % 3 === 1 ? 8 : 0)}
          y={y + 6 + i * 8}
          width={(w * 0.7 - 8) * lines[i % lines.length]}
          height={3}
          rx={1.5}
          fill={colors[i % colors.length]}
          opacity={0.85}
        />
      ))}
    </g>
  );
}

function SunsetScreen({ x, y, w, h }: Rect) {
  const id = safeId(useId());
  return (
    <g>
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c6cc4" />
          <stop offset="0.55" stopColor="#f08a6c" />
          <stop offset="1" stopColor="#f7c873" />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={`url(#sky${id})`} />
      <circle cx={x + w * 0.62} cy={y + h * 0.62} r={h * 0.16} fill="#fff4d6" />
      <rect x={x} y={y + h * 0.66} width={w} height={h * 0.34} fill="#2f6f8f" />
      <path
        d={`M ${x} ${y + h * 0.78} q ${w / 8} -4 ${w / 4} 0 t ${w / 4} 0 t ${w / 4} 0 t ${w / 4} 0`}
        stroke="#9fd3e6"
        strokeWidth={1.5}
        fill="none"
        opacity={0.7}
      />
    </g>
  );
}

function DesignScreen({ x, y, w, h }: Rect) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill="#f5f3ef" />
      <rect x={x} y={y} width={w} height={8} fill="#e4e0d8" />
      <rect
        x={x + 4}
        y={y + 12}
        width={w * 0.16}
        height={h - 16}
        rx={2}
        fill="#e9e5de"
      />
      <rect
        x={x + w * 0.22}
        y={y + 14}
        width={w * 0.34}
        height={h * 0.5}
        rx={3}
        fill="#2a9d8f"
      />
      <rect
        x={x + w * 0.6}
        y={y + 14}
        width={w * 0.2}
        height={h * 0.22}
        rx={3}
        fill="#e76f51"
      />
      <rect
        x={x + w * 0.6}
        y={y + 14 + h * 0.28}
        width={w * 0.2}
        height={h * 0.22}
        rx={3}
        fill="#f4a261"
      />
      <rect
        x={x + w * 0.22}
        y={y + h * 0.72}
        width={w * 0.58}
        height={4}
        rx={2}
        fill="#c9c3b8"
      />
      <rect
        x={x + w * 0.84}
        y={y + 12}
        width={w * 0.13}
        height={h - 16}
        rx={2}
        fill="#e9e5de"
      />
    </g>
  );
}

type Rect = { x: number; y: number; w: number; h: number };

export function Monitor({ id }: { id: MonitorId }) {
  const { w, h } = MONITOR_SIZES[id];
  const top = -MONITOR_NECK - h;
  const screen = { x: -w / 2 + 4, y: top + 4, w: w - 8, h: h - 8 };
  return (
    <g>
      <ellipse cx={0} cy={0} rx={30} ry={3} fill="#000" opacity={0.12} />
      <rect x={-26} y={-5} width={52} height={5} rx={2.5} fill={FRAME} />
      <rect
        x={-5}
        y={-MONITOR_NECK}
        width={10}
        height={MONITOR_NECK - 3}
        fill="#4a4a52"
      />
      <rect x={-w / 2} y={top} width={w} height={h} rx={4} fill={DARK} />
      {id === "monitor24" && <CodeScreen {...screen} />}
      {id === "monitor27" && <SunsetScreen {...screen} />}
      {id === "monitor34" && <DesignScreen {...screen} />}
      <rect
        x={-w / 2}
        y={top}
        width={w}
        height={h}
        rx={4}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.08}
      />
    </g>
  );
}

export const LAPTOP_HEIGHT = 72;

export function Laptop() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={62} ry={3} fill="#000" opacity={0.12} />
      <rect
        x={-52}
        y={-LAPTOP_HEIGHT}
        width={104}
        height={66}
        rx={4}
        fill={DARK}
      />
      <CodeScreen x={-48} y={-LAPTOP_HEIGHT + 4} w={96} h={58} />
      <polygon points="-62,0 62,0 55,-7 -55,-7" fill="#c3c7ce" />
      <rect x={-12} y={-3} width={24} height={2} rx={1} fill="#9aa0a8" />
    </g>
  );
}

export function KeyboardMouse({ mouseOffset = 82 }: { mouseOffset?: number }) {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={62} ry={3} fill="#000" opacity={0.1} />
      <polygon
        points="-55,-12 55,-12 60,-3 -60,-3"
        fill="#ececef"
        stroke="#cfcfd5"
      />
      <rect x={-60} y={-3} width={120} height={3} fill="#cfcfd5" />
      {[-9.5, -6.5].map((y) => (
        <line
          key={y}
          x1={-50}
          y1={y}
          x2={50}
          y2={y}
          stroke="#b7b7bf"
          strokeWidth={2}
          strokeDasharray="6 2"
        />
      ))}
      <g transform={`translate(${mouseOffset} 0)`}>
        <ellipse
          cx={0}
          cy={-4}
          rx={10}
          ry={5.5}
          fill="#ececef"
          stroke="#cfcfd5"
        />
        <line x1={0} y1={-9} x2={0} y2={-5} stroke="#cfcfd5" />
      </g>
    </g>
  );
}

export function Lamp({ on = true }: { on?: boolean }) {
  return (
    <g>
      {on && (
        <polygon
          points="-34,-96 -12,-88 30,-2 -110,-2"
          fill="#ffe7a0"
          opacity={0.28}
        />
      )}
      <ellipse cx={0} cy={-3} rx={22} ry={5} fill={FRAME} />
      <line
        x1={0}
        y1={-6}
        x2={18}
        y2={-80}
        stroke={FRAME}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <line
        x1={18}
        y1={-80}
        x2={-22}
        y2={-104}
        stroke={FRAME}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <circle cx={18} cy={-80} r={5} fill="#e76f51" />
      <g transform="translate(-22 -104) rotate(-35)">
        <path d="M -20 12 L 20 12 L 11 -10 L -11 -10 Z" fill="#e76f51" />
        <ellipse cx={0} cy={12} rx={20} ry={4} fill="#fff1c1" />
      </g>
    </g>
  );
}

export function DeskPlant() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={18} ry={3} fill="#000" opacity={0.12} />
      {[-38, -14, 10, 32, -60, 54].map((a, i) => (
        <ellipse
          key={a}
          cx={0}
          cy={-58 - (i % 2) * 6}
          rx={7}
          ry={22}
          fill={i % 2 ? "#4f7d55" : "#6a9a6c"}
          transform={`rotate(${a} 0 -32)`}
        />
      ))}
      <polygon points="-16,-30 16,-30 12,0 -12,0" fill="#c8714e" />
      <rect x={-18} y={-35} width={36} height={7} rx={2} fill="#b35f3e" />
    </g>
  );
}

export function Headphones() {
  return (
    <g>
      <ellipse cx={0} cy={-2} rx={16} ry={4} fill={FRAME} />
      <rect x={-2} y={-74} width={4} height={72} fill="#5a5a62" />
      <path
        d="M -22 -54 A 22 22 0 0 1 22 -54"
        stroke={FRAME}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect
            x={s * 24 - 7}
            y={-62}
            width={14}
            height={26}
            rx={6}
            fill={FRAME}
          />
          <rect
            x={s * 24 - (s < 0 ? -3 : 7)}
            y={-58}
            width={4}
            height={18}
            rx={2}
            fill="#2a9d8f"
          />
        </g>
      ))}
    </g>
  );
}

export function Webcam({ tripod = false }: { tripod?: boolean }) {
  const lift = tripod ? 34 : 0;
  return (
    <g>
      {tripod && (
        <g stroke={FRAME} strokeWidth={2.5} strokeLinecap="round">
          <line x1={0} y1={-lift} x2={-12} y2={0} />
          <line x1={0} y1={-lift} x2={12} y2={0} />
          <line x1={0} y1={-lift} x2={0} y2={0} />
        </g>
      )}
      {!tripod && (
        <rect x={-7} y={-2} width={14} height={6} rx={2} fill={DARK} />
      )}
      <rect
        x={-15}
        y={-14 - lift}
        width={30}
        height={13}
        rx={6.5}
        fill={DARK}
      />
      <circle cx={0} cy={-7.5 - lift} r={4.5} fill="#3d5a80" />
      <circle cx={-1.5} cy={-9 - lift} r={1.4} fill="#cde3ff" />
      <circle cx={10} cy={-7.5 - lift} r={1.2} fill="#7ee2a8" />
    </g>
  );
}
