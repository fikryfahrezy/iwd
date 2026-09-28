"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_SELECTION,
  canAdd,
  deskById,
  fitMonitors,
  itemById,
  parseSelection,
  type ChairColorId,
  type ChairId,
  type DeskId,
  type FinishId,
  type ItemId,
  type Selection,
} from "./catalog";

const STORAGE_KEY = "workspace-designer:selection";

let state: Selection = DEFAULT_SELECTION;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode, quota). The app still works.
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? parseSelection(JSON.parse(raw)) : null;
    if (saved) {
      state = saved;
      emit();
    }
  } catch {
    // Ignore corrupted storage.
  }
}

function setState(next: Selection) {
  state = next;
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  hydrate();
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => DEFAULT_SELECTION;

export function useSelection(): Selection {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const actions = {
  /** Returns how many monitors had to be removed to fit the new desk. */
  selectDesk(deskId: DeskId): number {
    const desk = deskById(deskId);
    const { items, removed } = fitMonitors(state.items, desk.monitorSlots);
    setState({
      ...state,
      deskId,
      items,
      standing: desk.standingHeight ? state.standing : false,
    });
    return removed;
  },
  setFinish(finish: FinishId) {
    setState({ ...state, finish });
  },
  toggleStanding() {
    if (!deskById(state.deskId).standingHeight) return;
    setState({ ...state, standing: !state.standing });
  },
  selectChair(chairId: ChairId) {
    setState({ ...state, chairId });
  },
  setChairColor(chairColor: ChairColorId) {
    setState({ ...state, chairColor });
  },
  add(id: ItemId) {
    if (!canAdd(state, id)) return;
    setState({
      ...state,
      items: { ...state.items, [id]: (state.items[id] ?? 0) + 1 },
    });
  },
  remove(id: ItemId) {
    const qty = (state.items[id] ?? 0) - 1;
    const items = { ...state.items };
    if (qty > 0) items[id] = Math.min(qty, itemById(id).max);
    else delete items[id];
    setState({ ...state, items });
  },
  apply(selection: Selection) {
    setState({ ...selection, items: { ...selection.items } });
  },
  clearAccessories() {
    setState({ ...state, items: {} });
  },
};
