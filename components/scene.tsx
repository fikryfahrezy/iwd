import { useId, type ReactNode } from "react";
import {
  chairById,
  chairColorById,
  deskById,
  finishById,
  itemById,
  type ItemId,
  type Selection,
} from "@/lib/catalog";
import { ChairArt } from "./art/chairs";
import {
  DeskPlant,
  Headphones,
  KeyboardMouse,
  LAPTOP_HEIGHT,
  Lamp,
  Laptop,
  MONITOR_SIZES,
  Monitor,
  Webcam,
  monitorHeight,
  type MonitorId,
} from "./art/desk-items";
import { DESK_TOP_DEPTH, DeskArt } from "./art/desks";
import {
  BeanBag,
  CoffeeStation,
  FloorPlant,
  Rug,
  StandingFan,
  Surfboard,
  WallArt,
} from "./art/room-items";

export const SCENE_WIDTH = 1000;
export const SCENE_HEIGHT = 620;

const DESK_X = 500;
const DESK_Y = 492;
const BACK_ROW = -DESK_TOP_DEPTH + 7;
const FRONT_ROW = -3;
const MONITOR_GAP = 8;

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

/** A placed, labelled scene element that animates in when it appears. */
function Placed({
  x,
  y,
  scale = 1,
  label,
  children,
}: {
  x: number;
  y: number;
  scale?: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <g
      transform={`translate(${x} ${y})${scale === 1 ? "" : ` scale(${scale})`}`}
    >
      <g className="pop-in">
        <title>{label}</title>
        {children}
      </g>
    </g>
  );
}

function Backdrop() {
  const id = safeId(useId());
  return (
    <g>
      <defs>
        <linearGradient id={`wall${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--scene-wall-top)" />
          <stop offset="1" stopColor="var(--scene-wall)" />
        </linearGradient>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd3e6" />
          <stop offset="1" stopColor="#fbe3c0" />
        </linearGradient>
        <clipPath id={`win${id}`}>
          <rect x={78} y={62} width={176} height={156} rx={6} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={1000} height={620} fill={`url(#wall${id})`} />
      {/* window with an ocean view */}
      <rect
        x={70}
        y={54}
        width={192}
        height={172}
        rx={10}
        fill="var(--scene-trim)"
      />
      <g clipPath={`url(#win${id})`}>
        <rect x={78} y={62} width={176} height={156} fill={`url(#sky${id})`} />
        <circle cx={196} cy={150} r={20} fill="#fff1c9" />
        <rect x={78} y={160} width={176} height={58} fill="#3d8fb0" />
        <path
          d="M 78 176 q 11 -5 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0 t 22 0"
          stroke="#bfe6f2"
          strokeWidth={2}
          fill="none"
        />
        <rect x={78} y={196} width={176} height={22} fill="#f1d9ad" />
        {/* palm tree */}
        <path
          d="M 112 218 C 116 180 122 150 132 118"
          stroke="#6b4f3a"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        {[-150, -110, -60, -20, 20].map((a) => (
          <ellipse
            key={a}
            cx={132}
            cy={100}
            rx={6}
            ry={22}
            fill="#3f7a52"
            transform={`rotate(${a + 90} 132 118)`}
          />
        ))}
      </g>
      <line
        x1={166}
        y1={62}
        x2={166}
        y2={218}
        stroke="var(--scene-trim)"
        strokeWidth={6}
      />
      <rect
        x={62}
        y={222}
        width={208}
        height={10}
        rx={4}
        fill="var(--scene-trim)"
      />
      {/* floor platform */}
      <ellipse
        cx={500}
        cy={534}
        rx={482}
        ry={80}
        fill="var(--scene-floor-edge)"
      />
      <ellipse cx={500} cy={520} rx={482} ry={80} fill="var(--scene-floor)" />
    </g>
  );
}

function monitorLayout(selection: Selection, band: number) {
  // Put the widest screens in the middle.
  const list: MonitorId[] = [];
  for (const id of ["monitor24", "monitor27", "monitor34"] as const) {
    for (let i = 0; i < (selection.items[id] ?? 0); i++) list.push(id);
  }
  const ordered: MonitorId[] = [];
  [...list]
    .sort((a, b) => MONITOR_SIZES[b].w - MONITOR_SIZES[a].w)
    .forEach((id, i) => (i % 2 ? ordered.unshift(id) : ordered.push(id)));

  const total =
    ordered.reduce((sum, id) => sum + MONITOR_SIZES[id].w, 0) +
    Math.max(0, ordered.length - 1) * MONITOR_GAP;
  const scale = total > band ? band / total : 1;
  let cursor = (-total * scale) / 2;
  return {
    scale,
    monitors: ordered.map((id, index) => {
      const w = MONITOR_SIZES[id].w * scale;
      const x = cursor + w / 2;
      cursor += w + MONITOR_GAP * scale;
      return { id, index, x };
    }),
  };
}

export function Scene({
  selection,
  className,
  title = "Preview of your workspace",
}: {
  selection: Selection;
  className?: string;
  title?: string;
}) {
  const desk = deskById(selection.deskId);
  const finish = finishById(selection.finish);
  const chair = chairById(selection.chairId);
  const chairColors = chairColorById(selection.chairColor);
  const has = (id: ItemId) => (selection.items[id] ?? 0) > 0;
  const label = (id: ItemId) => itemById(id).name;

  const height =
    selection.standing && desk.standingHeight
      ? desk.standingHeight
      : desk.height;
  const half = desk.width / 2;

  const monitorCenterX = -10;
  const { monitors, scale } = monitorLayout(selection, desk.width - 132);
  const hasMonitors = monitors.length > 0;

  // Laptop sits in front of the left-most screen, keyboard to its right.
  const leftScreenEdge = hasMonitors
    ? monitorCenterX +
      monitors[0].x -
      (MONITOR_SIZES[monitors[0].id].w * scale) / 2
    : 0;
  const laptopX = hasMonitors ? Math.max(-half + 66, leftScreenEdge + 20) : -70;
  const keyboardX = has("laptop") ? Math.max(0, laptopX + 126) : 0;

  // Webcam sits on the middle monitor, else on the laptop, else on a tripod.
  let webcam: { x: number; y: number; tripod: boolean };
  if (hasMonitors) {
    const center = monitors[Math.floor(monitors.length / 2)];
    webcam = {
      x: monitorCenterX + center.x,
      y: BACK_ROW - monitorHeight(center.id) * scale,
      tripod: false,
    };
  } else if (has("laptop")) {
    webcam = { x: laptopX, y: FRONT_ROW - LAPTOP_HEIGHT, tripod: false };
  } else {
    webcam = { x: -half + 110, y: BACK_ROW, tripod: true };
  }

  return (
    <svg
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      className={className}
      role="img"
      aria-label={title}
    >
      <Backdrop />

      {has("wallArt") && (
        <Placed x={820} y={140} label={label("wallArt")}>
          <WallArt />
        </Placed>
      )}
      {has("surfboard") && (
        <Placed x={930} y={500} label={label("surfboard")}>
          <Surfboard />
        </Placed>
      )}
      {has("rug") && (
        <Placed x={520} y={560} label={label("rug")}>
          <Rug />
        </Placed>
      )}
      {has("floorPlant") && (
        <Placed x={112} y={508} label={label("floorPlant")}>
          <FloorPlant />
        </Placed>
      )}
      {has("coffee") && (
        <Placed x={196} y={502} label={label("coffee")}>
          <CoffeeStation />
        </Placed>
      )}
      {has("fan") && (
        <Placed x={822} y={498} label={label("fan")}>
          <StandingFan />
        </Placed>
      )}

      {/* desk + everything on it */}
      <g transform={`translate(${DESK_X} ${DESK_Y})`}>
        <g key={desk.id} className="pop-in">
          <title>{desk.name}</title>
          <DeskArt
            id={desk.id}
            width={desk.width}
            height={height}
            sitHeight={desk.height}
            standHeight={desk.standingHeight}
            colors={finish}
          />
        </g>
        <g className="lift" style={{ transform: `translateY(${-height}px)` }}>
          {has("deskPlant") && (
            <Placed x={-half + 32} y={BACK_ROW} label={label("deskPlant")}>
              <DeskPlant />
            </Placed>
          )}
          {monitors.map((m) => (
            <Placed
              key={`${m.id}-${m.index}`}
              x={monitorCenterX + m.x}
              y={BACK_ROW}
              scale={scale}
              label={label(m.id)}
            >
              <Monitor id={m.id} />
            </Placed>
          ))}
          {has("lamp") && (
            <Placed x={half - 34} y={BACK_ROW} label={label("lamp")}>
              <Lamp />
            </Placed>
          )}
          {has("webcam") && (
            <Placed x={webcam.x} y={webcam.y} label={label("webcam")}>
              <Webcam tripod={webcam.tripod} />
            </Placed>
          )}
          {has("laptop") && (
            <Placed x={laptopX} y={FRONT_ROW} label={label("laptop")}>
              <Laptop />
            </Placed>
          )}
          {has("keyboard") && (
            <Placed x={keyboardX} y={FRONT_ROW} label={label("keyboard")}>
              <KeyboardMouse />
            </Placed>
          )}
          {has("headphones") && (
            <Placed x={half - 78} y={FRONT_ROW} label={label("headphones")}>
              <Headphones />
            </Placed>
          )}
        </g>
      </g>

      <g transform="translate(548 594) scale(0.82)">
        <g key={chair.id} className="pop-in">
          <title>{chair.name}</title>
          <ChairArt id={chair.id} colors={chairColors} />
        </g>
      </g>

      {has("beanBag") && (
        <Placed x={866} y={588} label={label("beanBag")}>
          <BeanBag />
        </Placed>
      )}
    </svg>
  );
}
