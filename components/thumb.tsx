import {
  chairColorById,
  deskById,
  finishById,
  type ChairColorId,
  type ChairId,
  type DeskId,
  type FinishId,
  type ItemId,
} from "@/lib/catalog";
import { ChairArt } from "./art/chairs";
import {
  DeskPlant,
  Headphones,
  KeyboardMouse,
  Lamp,
  Laptop,
  MONITOR_SIZES,
  Monitor,
  Webcam,
  monitorHeight,
} from "./art/desk-items";
import { DeskArt } from "./art/desks";
import {
  BeanBag,
  CoffeeStation,
  FloorPlant,
  Rug,
  StandingFan,
  Surfboard,
  WallArt,
} from "./art/room-items";

function Frame({
  viewBox,
  children,
}: {
  viewBox: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox={viewBox} className="h-full w-full" aria-hidden="true">
      {children}
    </svg>
  );
}

export function DeskThumb({ id, finish }: { id: DeskId; finish: FinishId }) {
  const desk = deskById(id);
  const w = desk.width / 2 + 16;
  return (
    <Frame viewBox={`${-w} ${-desk.height - 36} ${w * 2} ${desk.height + 52}`}>
      <DeskArt
        id={id}
        width={desk.width}
        height={desk.height}
        sitHeight={desk.height}
        standHeight={desk.standingHeight}
        colors={finishById(finish)}
      />
    </Frame>
  );
}

export function ChairThumb({
  id,
  color,
}: {
  id: ChairId;
  color: ChairColorId;
}) {
  return (
    <Frame viewBox="-112 -330 224 348">
      <ChairArt id={id} colors={chairColorById(color)} />
    </Frame>
  );
}

const ITEM_VIEWBOX: Partial<Record<ItemId, string>> = {
  laptop: "-72 -84 144 92",
  keyboard: "-68 -34 176 44",
  lamp: "-74 -128 112 134",
  deskPlant: "-44 -98 88 104",
  headphones: "-46 -88 92 94",
  webcam: "-34 -30 68 40",
  floorPlant: "-112 -216 224 226",
  coffee: "-66 -166 132 174",
  beanBag: "-92 -100 184 110",
  fan: "-56 -228 112 236",
  surfboard: "-66 -282 108 290",
  rug: "-196 -44 392 88",
  wallArt: "-70 -76 140 130",
};

export function ItemThumb({ id }: { id: ItemId }) {
  if (id === "monitor24" || id === "monitor27" || id === "monitor34") {
    const { w } = MONITOR_SIZES[id];
    const h = monitorHeight(id);
    return (
      <Frame viewBox={`${-w / 2 - 10} ${-h - 10} ${w + 20} ${h + 16}`}>
        <Monitor id={id} />
      </Frame>
    );
  }
  const art: Record<
    Exclude<ItemId, "monitor24" | "monitor27" | "monitor34">,
    React.ReactNode
  > = {
    laptop: <Laptop />,
    keyboard: <KeyboardMouse />,
    lamp: <Lamp />,
    deskPlant: <DeskPlant />,
    headphones: <Headphones />,
    webcam: <Webcam />,
    floorPlant: <FloorPlant />,
    coffee: <CoffeeStation />,
    beanBag: <BeanBag />,
    fan: <StandingFan />,
    surfboard: <Surfboard />,
    rug: <Rug />,
    wallArt: <WallArt />,
  };
  return (
    <Frame viewBox={ITEM_VIEWBOX[id] ?? "-100 -100 200 200"}>{art[id]}</Frame>
  );
}
