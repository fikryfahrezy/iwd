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
  formatUsd,
  usedMonitorSlots,
  type Item,
  type Selection,
} from "@/lib/catalog";
import { actions } from "@/lib/store";
import { CheckIcon, MinusIcon, PlusIcon } from "./icons";
import { ChairThumb, DeskThumb, ItemThumb } from "./thumb";

type TabId = "desk" | "chair" | "accessories" | "extras";

const TABS: { id: TabId; label: string }[] = [
  { id: "desk", label: "Desk" },
  { id: "chair", label: "Chair" },
  { id: "accessories", label: "Accessories" },
  { id: "extras", label: "Extras" },
];

function Price({ value }: { value: number }) {
  return (
    <span className="text-sm text-muted">
      <span className="font-semibold text-ink">{formatUsd(value)}</span>/wk
    </span>
  );
}

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
  return (
    <fieldset className="flex items-center gap-3">
      <legend className="sr-only">{label}</legend>
      <span className="text-sm font-medium text-muted" aria-hidden="true">
        {label}
      </span>
      <div className="flex gap-2">
        {options.map((o) => {
          const selected = o.id === value;
          return (
            <label
              key={o.id}
              title={o.name}
              className={`relative grid size-9 cursor-pointer place-items-center rounded-full border-2 transition has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-brand ${
                selected ? "border-ink" : "border-transparent hover:border-line"
              }`}
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
                className="size-[1.625rem] rounded-full border border-black/10"
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
      className={`group relative flex w-full items-center gap-4 rounded-2xl border bg-surface p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        selected
          ? "border-brand shadow-[inset_0_0_0_1px_var(--color-brand)]"
          : "border-line hover:border-muted/50 hover:shadow-sm"
      }`}
    >
      <span className="grid h-20 w-24 shrink-0 place-items-center rounded-xl bg-canvas p-2">
        {thumb}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="font-semibold">{name}</span>
          {badge && (
            <span className="shrink-0 rounded-full bg-coral/10 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-coral">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{blurb}</span>
        <span className="mt-1.5 block">
          <Price value={price} />
        </span>
      </span>
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full border transition ${
          selected
            ? "border-brand bg-brand text-white"
            : "border-line text-transparent"
        }`}
      >
        <CheckIcon className="size-3.5" />
      </span>
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
    ? `No room left: the ${desk.name} fits ${desk.monitorSlots} screen spots.`
    : item.blurb;

  return (
    <li
      className={`flex flex-col rounded-2xl border bg-surface p-3 transition ${
        added
          ? "border-brand shadow-[inset_0_0_0_1px_var(--color-brand)]"
          : "border-line"
      }`}
    >
      <div className="relative grid h-24 place-items-center rounded-xl bg-canvas p-3">
        <ItemThumb id={item.id} />
        {added && (
          <span className="absolute top-2 right-2 grid min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs leading-6 font-semibold text-white">
            {multi ? `×${qty}` : <CheckIcon className="size-3.5" />}
          </span>
        )}
      </div>
      <div className="mt-2.5 flex-1">
        <div className="text-sm leading-snug font-semibold">{item.name}</div>
        <p
          className={`mt-0.5 text-xs leading-snug ${deskFull ? "text-coral" : "text-muted"}`}
        >
          {hint}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Price value={item.pricePerWeek} />
        {multi ? (
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label={`${item.name} quantity`}
          >
            <button
              type="button"
              onClick={() => actions.remove(item.id)}
              disabled={!added}
              aria-label={`Remove one ${item.name}`}
              className="grid size-8 place-items-center rounded-full border border-line transition hover:bg-canvas disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-brand"
            >
              <MinusIcon />
            </button>
            <span
              className="w-5 text-center text-sm font-semibold tabular-nums"
              aria-live="polite"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => actions.add(item.id)}
              disabled={!addable}
              aria-label={`Add one ${item.name}`}
              className="grid size-8 place-items-center rounded-full bg-ink text-white transition hover:bg-ink/85 disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <PlusIcon />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label={`${added ? "Remove" : "Add"} ${item.name}`}
            disabled={!added && !addable}
            onClick={() =>
              added ? actions.remove(item.id) : actions.add(item.id)
            }
            className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:bg-line disabled:text-muted ${
              added
                ? "bg-brand-soft text-brand-strong hover:bg-brand-soft/70"
                : "bg-ink text-white hover:bg-ink/85"
            }`}
          >
            {added ? (
              <>
                <CheckIcon className="size-3.5" /> Added
              </>
            ) : (
              <>
                <PlusIcon className="size-3.5" /> Add
              </>
            )}
          </button>
        )}
      </div>
    </li>
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
  const freeSlots = desk.monitorSlots - usedMonitorSlots(selection.items);

  return (
    <div className="flex min-h-0 flex-col">
      <div
        role="tablist"
        aria-label="Categories"
        className="grid grid-cols-[1fr_1fr_1.45fr_1fr] gap-1 rounded-2xl bg-canvas p-1 shadow-[0_0_0_8px_var(--color-surface)] lg:sticky lg:top-2 lg:z-10"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          const i = TABS.findIndex((t) => t.id === tab);
          const next =
            TABS[
              (i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length
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
              className={`relative rounded-xl px-1 py-2.5 text-[13px] leading-tight font-semibold transition focus-visible:outline-2 focus-visible:outline-brand sm:text-sm ${
                active
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
              {!!n && (
                <span className="absolute -top-1.5 -right-1 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] leading-5 text-white ring-2 ring-canvas">
                  {n}
                  <span className="sr-only"> added</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="mt-5"
      >
        {tab === "desk" && (
          <div className="space-y-3">
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
            <div role="radiogroup" aria-label="Desk" className="space-y-2.5">
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
          <div className="space-y-3">
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
            <div role="radiogroup" aria-label="Chair" className="space-y-2.5">
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
            <p className="mb-3 text-sm text-muted">
              Screens: {desk.monitorSlots - freeSlots} of {desk.monitorSlots}{" "}
              spots used on your {desk.name.toLowerCase()}.
            </p>
            <ul className="grid grid-cols-2 gap-2.5">
              {ITEMS.filter((i) => i.zone === "desk").map((item) => (
                <ItemCard key={item.id} item={item} selection={selection} />
              ))}
            </ul>
          </>
        )}

        {tab === "extras" && (
          <>
            <p className="mb-3 text-sm text-muted">
              Make it feel like home. Bali style.
            </p>
            <ul className="grid grid-cols-2 gap-2.5">
              {ITEMS.filter((i) => i.zone === "room").map((item) => (
                <ItemCard key={item.id} item={item} selection={selection} />
              ))}
            </ul>
          </>
        )}

        {tab !== "extras" && (
          <button
            type="button"
            onClick={() => {
              const next = TABS[TABS.findIndex((t) => t.id === tab) + 1];
              setTab(next.id);
              document
                .getElementById(`tab-${next.id}`)
                ?.scrollIntoView({ block: "nearest" });
            }}
            className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-brand-strong transition hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand"
          >
            Next: {TABS[TABS.findIndex((t) => t.id === tab) + 1].label} →
          </button>
        )}
      </div>
    </div>
  );
}
