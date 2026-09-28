import type { DeskId } from "@/lib/catalog";

/** Depth of the visible desk top and its front edge thickness. */
export const DESK_TOP_DEPTH = 22;
const EDGE = 14;
const FRAME = "#34343a";
const FRAME_LIGHT = "#55555c";

type Colors = { top: string; side: string };

/** Desk top slab, drawn with its front edge line at y = 0. */
function Top({ width, colors }: { width: number; colors: Colors }) {
  const w = width / 2;
  return (
    <g>
      <polygon
        points={`${-w + 12},${-DESK_TOP_DEPTH} ${w - 12},${-DESK_TOP_DEPTH} ${w},0 ${-w},0`}
        fill={colors.top}
      />
      <rect
        x={-w}
        y={0}
        width={width}
        height={EDGE}
        rx={3}
        fill={colors.side}
      />
      <rect
        x={-w}
        y={0}
        width={width}
        height={2}
        fill="#ffffff"
        opacity={0.25}
      />
    </g>
  );
}

function Shadow({ width }: { width: number }) {
  return (
    <ellipse
      cx={0}
      cy={0}
      rx={width / 2 + 10}
      ry={10}
      fill="#000"
      opacity={0.08}
    />
  );
}

export function ClassicDesk({
  width,
  height,
  colors,
}: {
  width: number;
  height: number;
  colors: Colors;
}) {
  const w = width / 2;
  const legTop = -height + EDGE;
  const legH = height - EDGE;
  const pedX = w - 142;
  const drawerH = (legH - 22) / 2;
  return (
    <g>
      <Shadow width={width} />
      {/* back legs */}
      <rect
        x={-w + 36}
        y={legTop}
        width={12}
        height={legH - 10}
        fill={colors.side}
        opacity={0.55}
      />
      {/* front leg */}
      <rect
        x={-w + 10}
        y={legTop}
        width={18}
        height={legH}
        rx={2}
        fill={colors.side}
      />
      {/* drawer pedestal */}
      <rect
        x={pedX}
        y={legTop}
        width={132}
        height={legH}
        rx={3}
        fill={colors.side}
      />
      {[0, 1].map((i) => {
        const y = legTop + 8 + i * (drawerH + 6);
        return (
          <g key={i}>
            <rect
              x={pedX + 8}
              y={y}
              width={116}
              height={drawerH}
              rx={3}
              fill={colors.top}
            />
            <rect
              x={pedX + 50}
              y={y + drawerH / 2 - 3}
              width={32}
              height={6}
              rx={3}
              fill={FRAME}
              opacity={0.75}
            />
          </g>
        );
      })}
      <g transform={`translate(0 ${-height})`}>
        <Top width={width} colors={colors} />
      </g>
    </g>
  );
}

export function StandingDesk({
  width,
  height,
  sitHeight,
  standHeight,
  colors,
}: {
  width: number;
  height: number;
  sitHeight: number;
  standHeight: number;
  colors: Colors;
}) {
  const w = width / 2;
  const cols = [-w + 72, w - 72];
  const outerTop = -110;
  // Long enough to stay tucked inside the outer column when sitting.
  const innerLength = standHeight - EDGE - 96;
  return (
    <g>
      <Shadow width={width} />
      {cols.map((cx) => (
        <rect
          key={`foot${cx}`}
          x={cx - 48}
          y={-10}
          width={96}
          height={10}
          rx={5}
          fill={FRAME}
        />
      ))}
      <g className="lift" style={{ transform: `translateY(${-height}px)` }}>
        {cols.map((cx) => (
          <rect
            key={`inner${cx}`}
            x={cx - 8}
            y={EDGE}
            width={16}
            height={innerLength}
            fill={FRAME_LIGHT}
          />
        ))}
        <rect
          x={-w + 62}
          y={EDGE}
          width={width - 124}
          height={9}
          rx={2}
          fill={FRAME}
        />
        <Top width={width} colors={colors} />
        {/* control panel */}
        <rect x={-w + 26} y={EDGE} width={44} height={10} rx={3} fill={FRAME} />
        <circle
          cx={-w + 36}
          cy={EDGE + 5}
          r={2}
          fill={height > sitHeight ? "#7ee2a8" : "#f4a261"}
        />
        <rect
          x={-w + 44}
          y={EDGE + 3}
          width={8}
          height={4}
          rx={1}
          fill={FRAME_LIGHT}
        />
        <rect
          x={-w + 56}
          y={EDGE + 3}
          width={8}
          height={4}
          rx={1}
          fill={FRAME_LIGHT}
        />
      </g>
      {cols.map((cx) => (
        <rect
          key={`outer${cx}`}
          x={cx - 12}
          y={outerTop}
          width={24}
          height={-outerTop - 8}
          rx={2}
          fill={FRAME}
        />
      ))}
    </g>
  );
}

export function CompactDesk({
  width,
  height,
  colors,
}: {
  width: number;
  height: number;
  colors: Colors;
}) {
  const w = width / 2;
  const legTop = -height + EDGE;
  const legs = [-w + 34, w - 34];
  return (
    <g>
      <Shadow width={width} />
      {legs.map((x) => (
        <path
          key={`back${x}`}
          d={`M ${x - 6} ${legTop} L ${x + (x < 0 ? 16 : -16)} -8 L ${x + (x < 0 ? 30 : -30)} ${legTop}`}
          stroke={FRAME}
          strokeWidth={3}
          fill="none"
          opacity={0.35}
        />
      ))}
      {/* small shelf between the legs */}
      <rect
        x={-w + 40}
        y={-height * 0.3}
        width={width - 80}
        height={6}
        rx={2}
        fill={colors.side}
        opacity={0.8}
      />
      {legs.map((x) => (
        <path
          key={x}
          d={`M ${x - 12} ${legTop} L ${x} 0 L ${x + 12} ${legTop}`}
          stroke={FRAME}
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <g transform={`translate(0 ${-height})`}>
        <Top width={width} colors={colors} />
      </g>
    </g>
  );
}

export function DeskArt({
  id,
  width,
  height,
  sitHeight,
  standHeight,
  colors,
}: {
  id: DeskId;
  width: number;
  height: number;
  sitHeight: number;
  standHeight?: number;
  colors: Colors;
}) {
  if (id === "standing") {
    return (
      <StandingDesk
        width={width}
        height={height}
        sitHeight={sitHeight}
        standHeight={standHeight ?? height}
        colors={colors}
      />
    );
  }
  if (id === "compact") {
    return <CompactDesk width={width} height={height} colors={colors} />;
  }
  return <ClassicDesk width={width} height={height} colors={colors} />;
}
