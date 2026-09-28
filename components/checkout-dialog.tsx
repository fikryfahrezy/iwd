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
        className="fade-in absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="sheet-in relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h2 id="checkout-title" className="text-lg font-semibold">
            {order ? "You're all set" : "Review your setup"}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {order ? (
          <div className="overflow-y-auto px-5 py-8 text-center sm:px-10">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-brand text-white">
              <CheckIcon className="size-7" />
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">
              Your workspace is booked!
            </p>
            <p className="mx-auto mt-2 max-w-md text-muted">
              We&apos;ll deliver and set everything up on{" "}
              <span className="font-semibold text-ink">{order.date}</span>.
              Order{" "}
              <span className="font-mono font-semibold text-ink">
                {order.id}
              </span>
              .
            </p>
            <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-2xl border border-line">
              <Scene selection={selection} className="scene block w-full" />
            </div>
            <p className="mt-4 text-sm text-muted">
              {duration.label} · {formatUsd(total)} total
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onStartOver}
                className="rounded-full border border-line px-5 py-3 font-semibold transition hover:bg-canvas focus-visible:outline-2 focus-visible:outline-brand"
              >
                Design another setup
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-ink px-5 py-3 font-semibold text-white transition hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid overflow-y-auto sm:grid-cols-[1.1fr_1fr]">
              <div className="border-b border-line bg-canvas p-5 sm:border-r sm:border-b-0 sm:p-6">
                <div className="overflow-hidden rounded-2xl">
                  <Scene selection={selection} className="scene block w-full" />
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-surface p-4 text-sm">
                  <TruckIcon className="mt-0.5 size-5 shrink-0 text-brand" />
                  <p>
                    <span className="font-semibold">
                      Delivered &amp; set up {deliveryDate()}
                    </span>
                    <span className="block text-muted">
                      Free delivery, assembly and pickup anywhere in Bali.
                    </span>
                  </p>
                </div>
                <fieldset className="mt-5">
                  <legend className="text-sm font-semibold">
                    How long do you need it?
                  </legend>
                  <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-2 sm:gap-2">
                    {DURATIONS.map((d) => {
                      const active = d.id === durationId;
                      return (
                        <label
                          key={d.id}
                          className={`relative cursor-pointer rounded-xl border px-1 py-2 text-center text-[13px] sm:text-sm transition has-focus-visible:outline-2 has-focus-visible:outline-brand ${
                            active
                              ? "border-brand bg-brand-soft font-semibold text-brand-strong"
                              : "border-line hover:border-muted/50"
                          }`}
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
                            <span className="block text-[11px] font-semibold text-coral">
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
                        <span className="font-medium">
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
                      <span className="shrink-0 text-sm tabular-nums">
                        {formatUsd(l.pricePerWeek * l.qty)}
                        <span className="text-muted">/wk</span>
                      </span>
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
                    <div className="flex justify-between text-coral">
                      <dt>Long-stay discount</dt>
                      <dd className="tabular-nums">−{formatUsd(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted">Delivery &amp; setup</dt>
                    <dd>Free</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-line pt-3 text-base">
                    <dt className="font-semibold">Total</dt>
                    <dd className="text-2xl font-semibold tabular-nums">
                      {formatUsd(total)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-3 font-semibold text-muted transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
              >
                Keep designing
              </button>
              <button
                type="button"
                onClick={() =>
                  setOrder({ id: orderNumber(), date: deliveryDate() })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Rent this setup · {formatUsd(total)}
                <ArrowRightIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
