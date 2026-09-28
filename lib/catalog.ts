export type DeskId = "classic" | "standing" | "compact";
export type ChairId = "ergo" | "executive" | "task";
export type FinishId = "oak" | "walnut" | "white";
export type ChairColorId = "charcoal" | "sand" | "sage" | "ocean";

export type ItemId =
  | "monitor24"
  | "monitor27"
  | "monitor34"
  | "laptop"
  | "keyboard"
  | "lamp"
  | "deskPlant"
  | "headphones"
  | "webcam"
  | "floorPlant"
  | "coffee"
  | "beanBag"
  | "fan"
  | "surfboard"
  | "rug"
  | "wallArt";

export type Desk = {
  id: DeskId;
  name: string;
  blurb: string;
  pricePerWeek: number;
  /** Width of the desk top in scene units. */
  width: number;
  /** Height of the desk top from the floor in scene units (sitting). */
  height: number;
  /** Standing height, only for adjustable desks. */
  standingHeight?: number;
  /** How many monitor slots fit on the desk. */
  monitorSlots: number;
};

export type Chair = {
  id: ChairId;
  name: string;
  blurb: string;
  pricePerWeek: number;
};

export type ItemZone = "desk" | "room";

export type Item = {
  id: ItemId;
  name: string;
  blurb: string;
  pricePerWeek: number;
  zone: ItemZone;
  /** Maximum quantity. Monitors are further limited by desk slots. */
  max: number;
  /** Monitor slots consumed per unit. */
  slots?: number;
};

export const DESKS: Desk[] = [
  {
    id: "classic",
    name: "Teak Writing Desk",
    blurb: "Solid wood, two drawers. Room for three screens.",
    pricePerWeek: 8,
    width: 520,
    height: 200,
    monitorSlots: 3,
  },
  {
    id: "standing",
    name: "Electric Standing Desk",
    blurb: "Sit–stand at the push of a button. Try it in the preview.",
    pricePerWeek: 12,
    width: 540,
    height: 200,
    standingHeight: 270,
    monitorSlots: 3,
  },
  {
    id: "compact",
    name: "Compact Nomad Desk",
    blurb: "Small footprint for villas and shared rooms.",
    pricePerWeek: 5,
    width: 400,
    height: 190,
    monitorSlots: 2,
  },
];

export const CHAIRS: Chair[] = [
  {
    id: "ergo",
    name: "Ergonomic Mesh Chair",
    blurb: "Breathable mesh, lumbar support, headrest.",
    pricePerWeek: 7,
  },
  {
    id: "executive",
    name: "Executive Lounge Chair",
    blurb: "Plush padding for long calls.",
    pricePerWeek: 9,
  },
  {
    id: "task",
    name: "Minimal Task Chair",
    blurb: "Light, simple and comfy enough.",
    pricePerWeek: 4,
  },
];

export const ITEMS: Item[] = [
  {
    id: "monitor24",
    name: '24" Full HD Monitor',
    blurb: "Crisp everyday screen.",
    pricePerWeek: 6,
    zone: "desk",
    max: 3,
    slots: 1,
  },
  {
    id: "monitor27",
    name: '27" 4K Monitor',
    blurb: "Sharp text, great for design.",
    pricePerWeek: 9,
    zone: "desk",
    max: 3,
    slots: 1,
  },
  {
    id: "monitor34",
    name: '34" Ultrawide Monitor',
    blurb: "Two screens in one. Takes 2 spots.",
    pricePerWeek: 14,
    zone: "desk",
    max: 1,
    slots: 2,
  },
  {
    id: "laptop",
    name: '15" Laptop',
    blurb: "Ready to work, preinstalled.",
    pricePerWeek: 16,
    zone: "desk",
    max: 1,
  },
  {
    id: "keyboard",
    name: "Keyboard & Mouse",
    blurb: "Wireless, quiet keys.",
    pricePerWeek: 4,
    zone: "desk",
    max: 1,
  },
  {
    id: "lamp",
    name: "LED Desk Lamp",
    blurb: "Warm light for late sessions.",
    pricePerWeek: 3,
    zone: "desk",
    max: 1,
  },
  {
    id: "deskPlant",
    name: "Desk Plant",
    blurb: "A little green on your desk.",
    pricePerWeek: 2,
    zone: "desk",
    max: 1,
  },
  {
    id: "headphones",
    name: "Noise-Cancelling Headphones",
    blurb: "Focus mode, anywhere.",
    pricePerWeek: 5,
    zone: "desk",
    max: 1,
  },
  {
    id: "webcam",
    name: "4K Webcam",
    blurb: "Look sharp on client calls.",
    pricePerWeek: 3,
    zone: "desk",
    max: 1,
  },
  {
    id: "floorPlant",
    name: "Monstera Plant",
    blurb: "Big leaves, jungle vibes.",
    pricePerWeek: 3,
    zone: "room",
    max: 1,
  },
  {
    id: "coffee",
    name: "Coffee Station",
    blurb: "Espresso machine on a rolling cart.",
    pricePerWeek: 7,
    zone: "room",
    max: 1,
  },
  {
    id: "beanBag",
    name: "Bean Bag",
    blurb: "For breaks and reading.",
    pricePerWeek: 4,
    zone: "room",
    max: 1,
  },
  {
    id: "fan",
    name: "Standing Fan",
    blurb: "Keeps you cool in the tropics.",
    pricePerWeek: 3,
    zone: "room",
    max: 1,
  },
  {
    id: "surfboard",
    name: "Surfboard",
    blurb: "For the after-work session.",
    pricePerWeek: 12,
    zone: "room",
    max: 1,
  },
  {
    id: "rug",
    name: "Woven Rug",
    blurb: "Softens the room.",
    pricePerWeek: 3,
    zone: "room",
    max: 1,
  },
  {
    id: "wallArt",
    name: "Wall Art",
    blurb: "A framed print of the sea.",
    pricePerWeek: 2,
    zone: "room",
    max: 1,
  },
];

export const FINISHES: {
  id: FinishId;
  name: string;
  top: string;
  side: string;
}[] = [
  { id: "oak", name: "Oak", top: "#dcb67f", side: "#c09160" },
  { id: "walnut", name: "Walnut", top: "#8d5d3d", side: "#6c452d" },
  { id: "white", name: "White", top: "#f6f3ee", side: "#ddd6cb" },
];

export const CHAIR_COLORS: {
  id: ChairColorId;
  name: string;
  main: string;
  dark: string;
}[] = [
  { id: "charcoal", name: "Charcoal", main: "#4a4a50", dark: "#34343a" },
  { id: "sand", name: "Sand", main: "#cdb392", dark: "#b0946f" },
  { id: "sage", name: "Sage", main: "#8ea88c", dark: "#708b6f" },
  { id: "ocean", name: "Ocean", main: "#4f7f9c", dark: "#3b6680" },
];

export const DURATIONS = [
  { id: "1w", label: "1 week", weeks: 1, discount: 0 },
  { id: "2w", label: "2 weeks", weeks: 2, discount: 0 },
  { id: "1m", label: "1 month", weeks: 4, discount: 0.1 },
  { id: "3m", label: "3 months", weeks: 12, discount: 0.2 },
] as const;

export type DurationId = (typeof DURATIONS)[number]["id"];

export type Selection = {
  deskId: DeskId;
  finish: FinishId;
  standing: boolean;
  chairId: ChairId;
  chairColor: ChairColorId;
  items: Partial<Record<ItemId, number>>;
};

export const DEFAULT_SELECTION: Selection = {
  deskId: "classic",
  finish: "oak",
  standing: false,
  chairId: "ergo",
  chairColor: "charcoal",
  items: {},
};

export type Preset = {
  id: string;
  name: string;
  tagline: string;
  selection: Selection;
};

export const PRESETS: Preset[] = [
  {
    id: "nomad",
    name: "Nomad Starter",
    tagline: "Laptop, lamp, done.",
    selection: {
      deskId: "compact",
      finish: "white",
      standing: false,
      chairId: "task",
      chairColor: "sand",
      items: { laptop: 1, lamp: 1, deskPlant: 1 },
    },
  },
  {
    id: "dev",
    name: "Developer Pro",
    tagline: "Two 4K screens, sit–stand.",
    selection: {
      deskId: "standing",
      finish: "walnut",
      standing: false,
      chairId: "ergo",
      chairColor: "charcoal",
      items: {
        monitor27: 2,
        keyboard: 1,
        lamp: 1,
        headphones: 1,
        deskPlant: 1,
        floorPlant: 1,
      },
    },
  },
  {
    id: "creator",
    name: "Creator Studio",
    tagline: "Ultrawide, webcam, coffee.",
    selection: {
      deskId: "classic",
      finish: "oak",
      standing: false,
      chairId: "executive",
      chairColor: "ocean",
      items: {
        monitor34: 1,
        webcam: 1,
        keyboard: 1,
        lamp: 1,
        coffee: 1,
        wallArt: 1,
        rug: 1,
      },
    },
  },
  {
    id: "bali",
    name: "Bali Vibes",
    tagline: "Work a little, surf a lot.",
    selection: {
      deskId: "compact",
      finish: "oak",
      standing: false,
      chairId: "ergo",
      chairColor: "sage",
      items: {
        monitor24: 1,
        laptop: 1,
        deskPlant: 1,
        floorPlant: 1,
        beanBag: 1,
        fan: 1,
        surfboard: 1,
        rug: 1,
      },
    },
  },
];

export const deskById = (id: DeskId) => DESKS.find((d) => d.id === id)!;
export const chairById = (id: ChairId) => CHAIRS.find((c) => c.id === id)!;
export const itemById = (id: ItemId) => ITEMS.find((i) => i.id === id)!;
export const finishById = (id: FinishId) =>
  FINISHES.find((f) => f.id === id) ?? FINISHES[0];
export const chairColorById = (id: ChairColorId) =>
  CHAIR_COLORS.find((c) => c.id === id) ?? CHAIR_COLORS[0];

export const MONITOR_IDS = ITEMS.filter((i) => i.slots).map((i) => i.id);

export function usedMonitorSlots(items: Selection["items"]): number {
  return ITEMS.reduce(
    (sum, item) => sum + (item.slots ?? 0) * (items[item.id] ?? 0),
    0,
  );
}

/** Whether one more unit of the item can be added. */
export function canAdd(selection: Selection, id: ItemId): boolean {
  const item = itemById(id);
  const qty = selection.items[id] ?? 0;
  if (qty >= item.max) return false;
  if (item.slots) {
    const free =
      deskById(selection.deskId).monitorSlots -
      usedMonitorSlots(selection.items);
    return free >= item.slots;
  }
  return true;
}

/**
 * Drops monitors that no longer fit on the selected desk.
 * Returns the trimmed items and how many monitors were removed.
 */
export function fitMonitors(
  items: Selection["items"],
  capacity: number,
): { items: Selection["items"]; removed: number } {
  const next = { ...items };
  let removed = 0;
  // Remove the biggest monitors first, they are the least likely to fit.
  const order = [...MONITOR_IDS].reverse();
  while (usedMonitorSlots(next) > capacity) {
    const id = order.find((m) => (next[m] ?? 0) > 0);
    if (!id) break;
    next[id] = (next[id] ?? 0) - 1;
    if (next[id] === 0) delete next[id];
    removed += 1;
  }
  return { items: next, removed };
}

export type LineItem = {
  key: string;
  name: string;
  detail?: string;
  qty: number;
  pricePerWeek: number;
};

export function lineItems(selection: Selection): LineItem[] {
  const desk = deskById(selection.deskId);
  const chair = chairById(selection.chairId);
  const lines: LineItem[] = [
    {
      key: "desk",
      name: desk.name,
      detail: `${finishById(selection.finish).name} finish`,
      qty: 1,
      pricePerWeek: desk.pricePerWeek,
    },
    {
      key: "chair",
      name: chair.name,
      detail: chairColorById(selection.chairColor).name,
      qty: 1,
      pricePerWeek: chair.pricePerWeek,
    },
  ];
  for (const item of ITEMS) {
    const qty = selection.items[item.id] ?? 0;
    if (qty > 0) {
      lines.push({
        key: item.id,
        name: item.name,
        qty,
        pricePerWeek: item.pricePerWeek,
      });
    }
  }
  return lines;
}

export function weeklyTotal(selection: Selection): number {
  return lineItems(selection).reduce(
    (sum, l) => sum + l.pricePerWeek * l.qty,
    0,
  );
}

export function itemCount(selection: Selection): number {
  return lineItems(selection).reduce((sum, l) => sum + l.qty, 0);
}

const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatUsd = (value: number) =>
  Number.isInteger(Math.round(value * 100) / 100)
    ? usdWhole.format(value)
    : usdCents.format(value);

/** Validates untrusted (e.g. persisted) data into a Selection. */
export function parseSelection(value: unknown): Selection | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const desk = DESKS.find((d) => d.id === v.deskId);
  const chair = CHAIRS.find((c) => c.id === v.chairId);
  if (!desk || !chair) return null;
  const items: Selection["items"] = {};
  if (v.items && typeof v.items === "object") {
    for (const [id, qty] of Object.entries(
      v.items as Record<string, unknown>,
    )) {
      const item = ITEMS.find((i) => i.id === id);
      if (item && typeof qty === "number" && qty > 0) {
        items[item.id] = Math.min(Math.floor(qty), item.max);
      }
    }
  }
  return {
    deskId: desk.id,
    chairId: chair.id,
    finish: FINISHES.some((f) => f.id === v.finish)
      ? (v.finish as FinishId)
      : "oak",
    chairColor: CHAIR_COLORS.some((c) => c.id === v.chairColor)
      ? (v.chairColor as ChairColorId)
      : "charcoal",
    standing: desk.standingHeight ? v.standing === true : false,
    items: fitMonitors(items, desk.monitorSlots).items,
  };
}
