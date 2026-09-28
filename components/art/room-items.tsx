import { useId } from "react";

const FRAME = "#2f2f35";
const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

function MonsteraLeaf({
  angle,
  length,
  color,
}: {
  angle: number;
  length: number;
  color: string;
}) {
  // Leaf with a few side notches, pointing up, rotated around its stem base.
  const l = length;
  return (
    <g transform={`rotate(${angle})`}>
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={-l * 0.55}
        stroke="#4c7a4f"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d={`M 0 ${-l * 0.5}
            C ${l * 0.42} ${-l * 0.55} ${l * 0.42} ${-l * 1.05} 0 ${-l * 1.08}
            C ${-l * 0.42} ${-l * 1.05} ${-l * 0.42} ${-l * 0.55} 0 ${-l * 0.5} Z`}
        fill={color}
      />
      {[0.66, 0.8, 0.94].map((t) => (
        <g key={t} stroke="#fdfaf4" strokeWidth={2.2} strokeLinecap="round">
          <line x1={l * 0.34} y1={-l * t} x2={l * 0.16} y2={-l * (t - 0.02)} />
          <line
            x1={-l * 0.34}
            y1={-l * t}
            x2={-l * 0.16}
            y2={-l * (t - 0.02)}
          />
        </g>
      ))}
      <line
        x1={0}
        y1={-l * 0.52}
        x2={0}
        y2={-l * 1.02}
        stroke="#3f6e47"
        strokeWidth={1.5}
        opacity={0.6}
      />
    </g>
  );
}

export function FloorPlant() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={36} ry={6} fill="#000" opacity={0.1} />
      <g transform="translate(0 -64)">
        <MonsteraLeaf angle={-38} length={104} color="#5a8a5d" />
        <MonsteraLeaf angle={36} length={100} color="#5a8a5d" />
        <MonsteraLeaf angle={-14} length={140} color="#6b9c6c" />
        <MonsteraLeaf angle={16} length={126} color="#4f7f52" />
      </g>
      <polygon points="-30,-66 30,-66 24,0 -24,0" fill="#c9a46c" />
      {[-52, -38, -24, -10].map((y) => (
        <line
          key={y}
          x1={-28}
          y1={y}
          x2={28}
          y2={y}
          stroke="#a9844f"
          strokeWidth={2}
          opacity={0.6}
        />
      ))}
      <rect x={-33} y={-70} width={66} height={8} rx={3} fill="#b48f58" />
    </g>
  );
}

export function CoffeeStation() {
  const wood = "#c9955c";
  return (
    <g>
      <ellipse cx={0} cy={0} rx={56} ry={6} fill="#000" opacity={0.1} />
      {[-46, 41].map((x) => (
        <rect key={x} x={x} y={-94} width={5} height={86} fill={FRAME} />
      ))}
      {[-44, 44].map((x) => (
        <circle key={`w${x}`} cx={x} cy={-5} r={5} fill={FRAME} />
      ))}
      <rect x={-52} y={-42} width={104} height={7} rx={2} fill={wood} />
      {/* bag of beans on the lower shelf */}
      <path d="M -30 -42 L -28 -70 L -8 -70 L -6 -42 Z" fill="#8a5a3b" />
      <rect x={-24} y={-62} width={12} height={10} rx={2} fill="#f3e9d8" />
      <rect x={4} y={-54} width={26} height={12} rx={3} fill="#f3e9d8" />
      <rect x={-54} y={-100} width={108} height={8} rx={2} fill={wood} />
      {/* espresso machine */}
      <rect x={-34} y={-156} width={52} height={56} rx={6} fill="#d7dbe0" />
      <rect x={-34} y={-156} width={52} height={10} rx={5} fill="#b8bec6" />
      <circle cx={-20} cy={-136} r={4} fill={FRAME} />
      <circle cx={-6} cy={-136} r={4} fill="#e76f51" />
      <rect x={-18} y={-124} width={20} height={6} rx={2} fill={FRAME} />
      <rect
        x={-12}
        y={-110}
        width={10}
        height={9}
        rx={2}
        fill="#fff"
        stroke="#cfcfd5"
      />
      {/* mug with steam */}
      <rect x={28} y={-114} width={16} height={14} rx={3} fill="#2a9d8f" />
      <path
        d="M 44 -110 q 6 0 6 4 q 0 4 -6 4"
        stroke="#2a9d8f"
        strokeWidth={2.5}
        fill="none"
      />
      <path
        className="steam"
        d="M 34 -120 q -4 -6 0 -12 q 4 -6 0 -12 M 40 -120 q -4 -6 0 -12"
        stroke="#b7b7bf"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export function BeanBag({ color = "#e9a26b" }: { color?: string }) {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={78} ry={8} fill="#000" opacity={0.12} />
      <path
        d="M -74 -2 C -86 -44 -52 -92 -4 -88 C 46 -86 86 -50 74 -2 Z"
        fill={color}
      />
      <path
        d="M -52 -30 C -34 -52 12 -60 50 -34"
        stroke="#000"
        strokeOpacity={0.12}
        strokeWidth={3}
        fill="none"
      />
      <path
        d="M -40 -70 C -20 -82 10 -82 28 -74"
        stroke="#fff"
        strokeOpacity={0.3}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export function StandingFan() {
  return (
    <g>
      <ellipse cx={0} cy={-4} rx={32} ry={7} fill="#d4d4d9" />
      <rect x={-3} y={-150} width={6} height={146} fill="#c1c1c8" />
      <circle cx={0} cy={-176} r={44} fill="#ffffff" opacity={0.5} />
      <g className="fan-spin">
        {/* invisible disc keeps the group's box centred on the hub */}
        <circle cx={0} cy={-176} r={40} fill="none" />
        {[0, 120, 240].map((a) => (
          <ellipse
            key={a}
            cx={0}
            cy={-198}
            rx={11}
            ry={22}
            fill="#8ecae6"
            transform={`rotate(${a} 0 -176)`}
          />
        ))}
      </g>
      <circle
        cx={0}
        cy={-176}
        r={44}
        fill="none"
        stroke="#b9b9c0"
        strokeWidth={3}
      />
      {[0, 45, 90, 135].map((a) => (
        <line
          key={a}
          x1={0}
          y1={-220}
          x2={0}
          y2={-132}
          stroke="#b9b9c0"
          strokeWidth={1}
          transform={`rotate(${a} 0 -176)`}
        />
      ))}
      <circle cx={0} cy={-176} r={8} fill="#9a9aa2" />
    </g>
  );
}

export function Surfboard() {
  return (
    <g transform="rotate(-7)">
      <path
        d="M 0 -272 C 34 -220 34 -40 0 0 C -34 -40 -34 -220 0 -272 Z"
        fill="#f4e6c8"
        stroke="#dcc79f"
        strokeWidth={2}
      />
      <path
        d="M -6 -262 C 16 -210 16 -60 -6 -10"
        stroke="#2a9d8f"
        strokeWidth={7}
        fill="none"
      />
      <path
        d="M 6 -262 C 26 -210 26 -60 6 -10"
        stroke="#e76f51"
        strokeWidth={3}
        fill="none"
        opacity={0.9}
      />
      <path d="M 0 -30 L 8 -10 L -4 -14 Z" fill="#2a9d8f" />
    </g>
  );
}

/** Rug is anchored at its centre. */
export function Rug() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={190} ry={36} fill="#e0c9a3" />
      <ellipse
        cx={0}
        cy={0}
        rx={166}
        ry={29}
        fill="none"
        stroke="#c7a676"
        strokeWidth={3}
        strokeDasharray="10 6"
      />
      <ellipse cx={0} cy={0} rx={120} ry={20} fill="#d4b789" />
      <ellipse
        cx={0}
        cy={0}
        rx={74}
        ry={12}
        fill="none"
        stroke="#fdf6ea"
        strokeWidth={2}
        opacity={0.7}
      />
    </g>
  );
}

/** Wall art is anchored at its centre. */
export function WallArt() {
  const id = safeId(useId());
  return (
    <g>
      <line
        x1={-30}
        y1={-46}
        x2={0}
        y2={-70}
        stroke={FRAME}
        strokeWidth={1.5}
      />
      <line x1={30} y1={-46} x2={0} y2={-70} stroke={FRAME} strokeWidth={1.5} />
      <rect
        x={-62}
        y={-47}
        width={124}
        height={94}
        fill="#000"
        opacity={0.08}
        transform="translate(3 4)"
      />
      <rect
        x={-62}
        y={-47}
        width={124}
        height={94}
        fill="#fdfaf4"
        stroke={FRAME}
        strokeWidth={5}
      />
      <defs>
        <clipPath id={`art${id}`}>
          <rect x={-46} y={-32} width={92} height={64} />
        </clipPath>
      </defs>
      <g clipPath={`url(#art${id})`}>
        <rect x={-46} y={-32} width={92} height={64} fill="#f7e3c3" />
        <circle cx={14} cy={-6} r={14} fill="#e76f51" />
        <path
          d="M -46 8 q 12 -10 23 0 t 23 0 t 23 0 t 23 0 V 32 H -46 Z"
          fill="#2a9d8f"
        />
        <path
          d="M -46 18 q 12 -8 23 0 t 23 0 t 23 0 t 23 0 V 32 H -46 Z"
          fill="#23766c"
        />
      </g>
    </g>
  );
}
