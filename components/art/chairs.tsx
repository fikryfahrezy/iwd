import type { ChairId } from "@/lib/catalog";

const FRAME = "#2f2f35";
const METAL = "#8b8d94";

type Colors = { main: string; dark: string };

/** Five-star base with casters, seen from behind. */
function Base() {
  const feet = [-80, -42, 42, 80];
  return (
    <g>
      <ellipse cx={0} cy={-2} rx={92} ry={9} fill="#000" opacity={0.1} />
      {feet.map((x) => (
        <line
          key={x}
          x1={0}
          y1={-24}
          x2={x}
          y2={Math.abs(x) > 60 ? -12 : -6}
          stroke={FRAME}
          strokeWidth={9}
          strokeLinecap="round"
        />
      ))}
      <line
        x1={0}
        y1={-24}
        x2={0}
        y2={-2}
        stroke={FRAME}
        strokeWidth={9}
        strokeLinecap="round"
      />
      {[...feet, 0].map((x) => (
        <circle
          key={`c${x}`}
          cx={x}
          cy={Math.abs(x) > 60 ? -6 : x === 0 ? 4 : 0}
          r={7}
          fill="#1f1f23"
        />
      ))}
      <rect x={-6} y={-82} width={12} height={60} fill={METAL} />
      <rect x={-10} y={-62} width={20} height={40} rx={4} fill={FRAME} />
    </g>
  );
}

function ErgoChair({ colors }: { colors: Colors }) {
  return (
    <g>
      <Base />
      {/* seat */}
      <rect
        x={-72}
        y={-104}
        width={144}
        height={24}
        rx={12}
        fill={colors.dark}
      />
      {/* armrests */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s * 78 - 4} y={-152} width={8} height={52} fill={FRAME} />
          <rect
            x={s * 78 - 24}
            y={-160}
            width={48}
            height={11}
            rx={5.5}
            fill={FRAME}
          />
        </g>
      ))}
      {/* spine */}
      <rect x={-8} y={-160} width={16} height={64} rx={4} fill={FRAME} />
      {/* back frame + mesh */}
      <rect x={-64} y={-274} width={128} height={156} rx={28} fill={FRAME} />
      <rect
        x={-57}
        y={-267}
        width={114}
        height={142}
        rx={23}
        fill={colors.main}
      />
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1={-50 + i * 12.5}
          y1={-262}
          x2={-50 + i * 12.5}
          y2={-130}
          stroke={colors.dark}
          strokeWidth={1.5}
          opacity={0.45}
        />
      ))}
      {/* lumbar */}
      <rect
        x={-50}
        y={-172}
        width={100}
        height={16}
        rx={8}
        fill={FRAME}
        opacity={0.9}
      />
      {/* headrest */}
      <rect x={-5} y={-292} width={10} height={22} fill={FRAME} />
      <rect x={-42} y={-318} width={84} height={30} rx={13} fill={FRAME} />
      <rect
        x={-37}
        y={-314}
        width={74}
        height={22}
        rx={10}
        fill={colors.main}
      />
    </g>
  );
}

function ExecutiveChair({ colors }: { colors: Colors }) {
  const tufts = [0, 1, 2, 3].flatMap((r) =>
    (r % 2 ? [-18, 18] : [-36, 0, 36]).map((x) => (
      <circle
        key={`${r}:${x}`}
        cx={x}
        cy={-262 + r * 34}
        r={3}
        fill={colors.dark}
      />
    )),
  );
  return (
    <g>
      <Base />
      <rect
        x={-80}
        y={-112}
        width={160}
        height={32}
        rx={14}
        fill={colors.dark}
      />
      {/* padded armrests */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s * 84 - 5} y={-150} width={10} height={44} fill={FRAME} />
          <rect
            x={s * 84 - 16}
            y={-172}
            width={32}
            height={26}
            rx={12}
            fill={colors.dark}
          />
        </g>
      ))}
      <rect x={-10} y={-140} width={20} height={40} fill={FRAME} />
      {/* back */}
      <rect
        x={-76}
        y={-300}
        width={152}
        height={184}
        rx={44}
        fill={colors.dark}
      />
      <rect
        x={-68}
        y={-292}
        width={136}
        height={170}
        rx={38}
        fill={colors.main}
      />
      {tufts}
      <path
        d="M -50 -286 Q 0 -300 50 -286"
        stroke="#fff"
        strokeWidth={4}
        opacity={0.18}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function TaskChair({ colors }: { colors: Colors }) {
  return (
    <g>
      <Base />
      <rect
        x={-64}
        y={-102}
        width={128}
        height={20}
        rx={10}
        fill={colors.dark}
      />
      <rect x={-5} y={-124} width={10} height={26} fill={FRAME} />
      <rect
        x={-56}
        y={-204}
        width={112}
        height={84}
        rx={24}
        fill={colors.dark}
      />
      <rect
        x={-50}
        y={-198}
        width={100}
        height={72}
        rx={20}
        fill={colors.main}
      />
      <path
        d="M -34 -190 Q 0 -198 34 -190"
        stroke="#fff"
        strokeWidth={4}
        opacity={0.2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export function ChairArt({ id, colors }: { id: ChairId; colors: Colors }) {
  if (id === "executive") return <ExecutiveChair colors={colors} />;
  if (id === "task") return <TaskChair colors={colors} />;
  return <ErgoChair colors={colors} />;
}
