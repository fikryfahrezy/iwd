"use client";

import { useEffect, useRef, useState } from "react";
import {
  DURATIONS,
  formatUsd,
  lineItems,
  weeklyTotal,
  type DurationId,
  type Selection,
} from "@/lib/catalog";
import { ArrowRightIcon, CheckIcon, CloseIcon, TruckIcon } from "./icons";
import { Scene } from "./scene";
import { Button, IconButton } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { focusRingWithin, selectable } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

function deliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function orderNumber() {
  return `WS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function CheckoutDialog({
  selection,
  onClose,
  onStartOver,
}: {
  selection: Selection;
  onClose: () => void;
  onStartOver: () => void;
}) {
  const [durationId, setDurationId] = useState<DurationId>("1m");
  const [order, setOrder] = useState<{ id: string; date: string } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      // Keep focus inside the dialog.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  const duration = DURATIONS.find((d) => d.id === durationId)!;
  const lines = lineItems(selection);
  const weekly = weeklyTotal(selection);
  const subtotal = weekly * duration.weeks;
  const discount = subtotal * duration.discount;
  const total = subtotal - discount;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="fade-in absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="sheet-in relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl ring-1 ring-black/5 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 sm:px-6">
          <h2 id="checkout-title" className="text-base font-semibold">
            {order ? "You're all set" : "Review your setup"}
          </h2>
          <IconButton ref={closeRef} label="Close" onClick={onClose}>
            <CloseIcon className="size-5" />
          </IconButton>
        </div>

        {order ? (
          <div className="overflow-y-auto px-5 py-8 text-center sm:px-10">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
              <CheckIcon className="size-6" />
            </div>
            <p className="mt-4 text-xl font-semibold tracking-tight">
              Your workspace is booked!
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-[15px] text-muted">
              We&apos;ll deliver and set everything up on{" "}
              <span className="font-medium text-ink">{order.date}</span>. Order{" "}
              <span className="font-mono font-medium text-ink">{order.id}</span>
              .
            </p>
            <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-xl border border-line">
              <Scene selection={selection} className="scene block w-full" />
            </div>
            <p className="mt-4 text-sm text-muted">
              {duration.label} · {formatUsd(total)} total
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Button size="lg" onClick={onStartOver}>
                Design another setup
              </Button>
              <Button variant="dark" size="lg" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid overflow-y-auto sm:grid-cols-[1.1fr_1fr]">
              <div className="border-b border-line bg-subtle/60 p-5 sm:border-r sm:border-b-0 sm:p-6">
                <div className="overflow-hidden rounded-xl border border-line">
                  <Scene selection={selection} className="scene block w-full" />
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 text-sm">
                  <TruckIcon className="mt-0.5 size-5 shrink-0 text-brand" />
                  <p>
                    <span className="font-medium">
                      Delivered &amp; set up {deliveryDate()}
                    </span>
                    <span className="block text-muted">
                      Free delivery, assembly and pickup anywhere in Bali.
                    </span>
                  </p>
                </div>
                <fieldset className="mt-5">
                  <legend className="text-sm font-medium">
                    How long do you need it?
                  </legend>
                  <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-2">
                    {DURATIONS.map((d) => {
                      const active = d.id === durationId;
                      return (
                        <label
                          key={d.id}
                          className={cn(
                            "cursor-pointer rounded-lg bg-surface px-1 py-2 text-center text-[13px] sm:text-sm",
                            selectable(active),
                            focusRingWithin,
                            active
                              ? "font-medium text-ink"
                              : "text-muted hover:text-ink",
                          )}
                        >
                          <input
                            type="radio"
                            name="duration"
                            value={d.id}
                            checked={active}
                            onChange={() => setDurationId(d.id)}
                            className="sr-only"
                          />
                          {d.label}
                          {d.discount > 0 && (
                            <span className="block text-[11px] font-medium text-brand">
                              −{Math.round(d.discount * 100)}%
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              <div className="p-5 sm:p-6">
                <ul className="divide-y divide-line">
                  {lines.map((l) => (
                    <li
                      key={l.key}
                      className="flex items-baseline justify-between gap-3 py-2"
                    >
                      <span className="min-w-0">
                        <span className="text-[15px]">
                          {l.qty > 1 && (
                            <span className="text-muted">{l.qty}× </span>
                          )}
                          {l.name}
                        </span>
                        {l.detail && (
                          <span className="block text-xs text-muted">
                            {l.detail}
                          </span>
                        )}
                      </span>
                      <Price
                        value={l.pricePerWeek * l.qty}
                        className="shrink-0"
                      />
                    </li>
                  ))}
                </ul>

                <dl className="mt-5 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">
                      {formatUsd(weekly)}/wk × {duration.weeks}{" "}
                      {duration.weeks === 1 ? "week" : "weeks"}
                    </dt>
                    <dd className="tabular-nums">{formatUsd(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand">
                      <dt>Long-stay discount</dt>
                      <dd className="tabular-nums">−{formatUsd(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted">Delivery &amp; setup</dt>
                    <dd>Free</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-line pt-3 text-base">
                    <dt className="font-medium">Total</dt>
                    <dd className="text-2xl font-semibold tracking-tight tabular-nums">
                      {formatUsd(total)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
              <Button variant="ghost" size="lg" onClick={onClose}>
                Keep designing
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  setOrder({ id: orderNumber(), date: deliveryDate() })
                }
                iconEnd={<ArrowRightIcon />}
              >
                Rent this setup · {formatUsd(total)}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
