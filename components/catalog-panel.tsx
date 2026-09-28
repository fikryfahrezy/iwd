"use client";

import { useState } from "react";
import {
  CHAIRS,
  CHAIR_COLORS,
  DESKS,
  FINISHES,
  ITEMS,
  canAdd,
  deskById,
  usedMonitorSlots,
  type Item,
  type Selection,
} from "@/lib/catalog";
import { actions } from "@/lib/store";
import { ArrowRightIcon, CheckIcon, PlusIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Stepper } from "@/components/ui/stepper";
import { focusRing, focusRingWithin, selectable } from "@/components/ui/styles";
import { cn } from "@/lib/utils";
import { ChairThumb, DeskThumb, ItemThumb } from "./thumb";

type TabId = "desk" | "chair" | "accessories" | "extras";

const TABS: { id: TabId; label: string }[] = [
  { id: "desk", label: "Desk" },
  { id: "chair", label: "Chair" },
  { id: "accessories", label: "Accessories" },
  { id: "extras", label: "Extras" },
];

function Swatches<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; name: string; color: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const current = options.find((o) => o.id === value);
  return (
    <fieldset className="flex items-center justify-between gap-3">
      <legend className="sr-only">{label}</legend>
      <span className="text-sm text-muted" aria-hidden="true">
        {label}
        <span className="ml-1.5 font-medium text-ink">{current?.name}</span>
      </span>
      <div className="flex gap-1.5">
        {options.map((o) => {
          const selected = o.id === value;
          return (
            <label
              key={o.id}
              title={o.name}
              className={cn(
                "relative grid size-8 cursor-pointer place-items-center rounded-full border-[1.5px] transition",
                focusRingWithin,
                selected
                  ? "border-ink"
                  : "border-transparent hover:border-line-strong",
              )}
            >
              <input
                type="radio"
                name={label}
                value={o.id}
                checked={selected}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              <span
                className="size-6 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]"
                style={{ background: o.color }}
              />
              <span className="sr-only">{o.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function SelectDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full transition",
        selected
          ? "bg-ink text-white"
          : "shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]",
      )}
    >
      {selected && <CheckIcon className="size-3" />}
    </span>
  );
}

function OptionCard({
  selected,
  onSelect,
  thumb,
  name,
  blurb,
  price,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  thumb: React.ReactNode;
  name: string;
  blurb: string;
  price: number;
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl bg-surface p-2.5 pr-4 text-left",
        selectable(selected),
        focusRing,
      )}
    >
      <span className="grid h-[72px] w-24 shrink-0 place-items-center rounded-lg bg-subtle p-2">
        {thumb}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[15px] font-medium">{name}</span>
          {badge && (
            <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-brand-strong">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted">
          {blurb}
        </span>
        <span className="mt-1.5 block">
          <Price value={price} />
        </span>
      </span>
      <SelectDot selected={selected} />
    </button>
  );
}

function ItemCard({ item, selection }: { item: Item; selection: Selection }) {
  const qty = selection.items[item.id] ?? 0;
  const addable = canAdd(selection, item.id);
  const desk = deskById(selection.deskId);
  const deskFull = !!item.slots && qty < item.max && !addable;
  const multi = item.max > 1;
  const added = qty > 0;

  const hint = deskFull
    ? `No room left on the ${desk.name.toLowerCase()}.`
    : item.blurb;

  return (
    <li
      className={cn(
        "flex flex-col rounded-xl bg-surface p-2.5",
        selectable(added, "soft"),
      )}
    >
      <div className="relative grid h-24 place-items-center rounded-lg bg-subtle p-3">
        <ItemThumb id={item.id} />
        {added && (
          <span className="absolute top-2 right-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[11px] font-medium text-white tabular-nums">
            {multi ? qty : <CheckIcon className="size-3" />}
          </span>
        )}
      </div>
      <div className="mt-2.5 flex-1 px-0.5">
        <div className="text-sm leading-snug font-medium">{item.name}</div>
        <p
          className={cn(
            "mt-0.5 text-xs leading-snug",
            deskFull ? "text-amber-700" : "text-muted",
          )}
        >
          {hint}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 px-0.5">
        <Price value={item.pricePerWeek} />
        {multi ? (
          <Stepper
            label={item.name}
            value={qty}
            onDecrement={() => actions.remove(item.id)}
            onIncrement={() => actions.add(item.id)}
            canIncrement={addable}
          />
        ) : (
          <Button
            variant={added ? "subtle" : "secondary"}
            aria-label={`${added ? "Remove" : "Add"} ${item.name}`}
            disabled={!added && !addable}
            onClick={() =>
              added ? actions.remove(item.id) : actions.add(item.id)
            }
            icon={
              added ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <PlusIcon className="size-3.5" />
              )
            }
          >
            {added ? "Added" : "Add"}
          </Button>
        )}
      </div>
    </li>
  );
}

function ScreenMeter({ used, total }: { used: number; total: number }) {
  return (
    <div className="mb-3 flex items-center justify-between text-[13px] text-muted">
      <span>Screen spots on your desk</span>
      <span className="flex items-center gap-2">
        <span className="flex gap-1" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-4 rounded-full",
                i < used ? "bg-ink" : "bg-line-strong",
              )}
            />
          ))}
        </span>
        <span className="font-medium text-ink tabular-nums">
          {used}/{total}
        </span>
      </span>
    </div>
  );
}

export function CatalogPanel({
  selection,
  onDeskChange,
}: {
  selection: Selection;
  onDeskChange: (
    removedMonitors: number,
    deskName: string,
    slots: number,
  ) => void;
}) {
  const [tab, setTab] = useState<TabId>("desk");

  const count = (zone: Item["zone"]) =>
    ITEMS.filter((i) => i.zone === zone).reduce(
      (sum, i) => sum + (selection.items[i.id] ?? 0),
      0,
    );
  const counts: Record<TabId, number | null> = {
    desk: null,
    chair: null,
    accessories: count("desk"),
    extras: count("room"),
  };

  const desk = deskById(selection.deskId);
  const nextTab = TABS[TABS.findIndex((t) => t.id === tab) + 1];

  return (
    <div className="flex min-h-0 flex-col">
      {/* Solid backing so cards scrolling underneath never peek through. */}
      <div className="bg-surface lg:sticky lg:top-0 lg:z-10 lg:pt-1 lg:pb-3">
        <div
          role="tablist"
          aria-label="Categories"
          className="grid grid-cols-[1fr_1fr_1.5fr_1.1fr] gap-0.5 rounded-xl bg-subtle p-1"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const i = TABS.findIndex((t) => t.id === tab);
            const next =
              TABS[
                (i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) %
                  TABS.length
              ];
            setTab(next.id);
            document.getElementById(`tab-${next.id}`)?.focus();
          }}
        >
          {TABS.map((t) => {
            const active = t.id === tab;
            const n = counts[t.id];
            return (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-[13px] font-medium transition",
                  focusRing,
                  active
                    ? "bg-surface text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06),0_0_0_1px_rgb(0_0_0/0.04)]"
                    : "text-muted hover:text-ink",
                )}
              >
                {t.label}
                {!!n && (
                  <span
                    className={cn(
                      "grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[11px] tabular-nums",
                      active ? "bg-ink text-white" : "bg-line-strong text-ink",
                    )}
                  >
                    {n}
                    <span className="sr-only"> added</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="mt-4 lg:mt-1"
      >
        {tab === "desk" && (
          <div className="space-y-4">
            <Swatches
              label="Finish"
              value={selection.finish}
              onChange={actions.setFinish}
              options={FINISHES.map((f) => ({
                id: f.id,
                name: f.name,
                color: f.top,
              }))}
            />
            <div role="radiogroup" aria-label="Desk" className="space-y-2">
              {DESKS.map((d) => (
                <OptionCard
                  key={d.id}
                  selected={d.id === selection.deskId}
                  onSelect={() => {
                    if (d.id === selection.deskId) return;
                    const removed = actions.selectDesk(d.id);
                    onDeskChange(removed, d.name, d.monitorSlots);
                  }}
                  thumb={<DeskThumb id={d.id} finish={selection.finish} />}
                  name={d.name}
                  blurb={d.blurb}
                  price={d.pricePerWeek}
                  badge={d.standingHeight ? "Sit–stand" : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "chair" && (
          <div className="space-y-4">
            <Swatches
              label="Colour"
              value={selection.chairColor}
              onChange={actions.setChairColor}
              options={CHAIR_COLORS.map((c) => ({
                id: c.id,
                name: c.name,
                color: c.main,
              }))}
            />
            <div role="radiogroup" aria-label="Chair" className="space-y-2">
              {CHAIRS.map((c) => (
                <OptionCard
                  key={c.id}
                  selected={c.id === selection.chairId}
                  onSelect={() => actions.selectChair(c.id)}
                  thumb={<ChairThumb id={c.id} color={selection.chairColor} />}
                  name={c.name}
                  blurb={c.blurb}
                  price={c.pricePerWeek}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "accessories" && (
          <>
            <ScreenMeter
              used={usedMonitorSlots(selection.items)}
              total={desk.monitorSlots}
            />
            <ul className="grid grid-cols-2 gap-2">
              {ITEMS.filter((i) => i.zone === "desk").map((item) => (
                <ItemCard key={item.id} item={item} selection={selection} />
              ))}
            </ul>
          </>
        )}

        {tab === "extras" && (
          <>
            <p className="mb-3 text-[13px] text-muted">
              Make it feel like home, Bali style.
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {ITEMS.filter((i) => i.zone === "room").map((item) => (
                <ItemCard key={item.id} item={item} selection={selection} />
              ))}
            </ul>
          </>
        )}

        {nextTab && (
          <Button
            variant="plain"
            size="lg"
            className="mt-4 w-full"
            onClick={() => {
              setTab(nextTab.id);
              document
                .getElementById(`tab-${nextTab.id}`)
                ?.scrollIntoView({ block: "nearest" });
            }}
            iconEnd={<ArrowRightIcon className="size-3.5" />}
          >
            Next: {nextTab.label}
          </Button>
        )}
      </div>
    </div>
  );
}
