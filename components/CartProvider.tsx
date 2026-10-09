"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { CartLine, CartState, Totals } from "@/lib/types";
import { calcTotals } from "@/lib/pricing";
import { getProduct } from "@/data/products";

const KEY = "tapspot.cart.v1";
const empty: CartState = { lines: [], discountCode: null };

type Action =
  | { type: "hydrate"; state: CartState }
  | { type: "add"; line: CartLine }
  | { type: "qty"; lineId: string; quantity: number }
  | { type: "remove"; lineId: string }
  | { type: "discount"; code: string | null }
  | { type: "clear" };

const sameSetup = (a: Record<string, string>, b: Record<string, string>) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if ((a[k] ?? "").trim() !== (b[k] ?? "").trim()) return false;
  return true;
};

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.lines.find(
        (l) => l.productId === action.line.productId && sameSetup(l.setup, action.line.setup),
      );
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.lineId === existing.lineId ? { ...l, quantity: Math.min(99, l.quantity + action.line.quantity) } : l,
          ),
        };
      }
      return { ...state, lines: [...state.lines, action.line] };
    }
    case "qty":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.lineId === action.lineId ? { ...l, quantity: Math.min(99, action.quantity) } : l))
          .filter((l) => l.quantity > 0),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.lineId !== action.lineId) };
    case "discount":
      return { ...state, discountCode: action.code };
    case "clear":
      return empty;
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  totals: Totals;
  discountCode: string | null;
  ready: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (productId: string, quantity: number, setup: Record<string, string>) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  applyDiscount: (code: string | null) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, empty);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load saved cart once on the client. Drop lines whose product no longer exists.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        const lines = (parsed.lines ?? []).filter((l) => {
          const p = getProduct(l.productId);
          return p && p.available && p.price !== null;
        });
        dispatch({ type: "hydrate", state: { lines, discountCode: parsed.discountCode ?? null } });
      }
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, ready]);

  const addItem = useCallback((productId: string, quantity: number, setup: Record<string, string>) => {
    dispatch({
      type: "add",
      line: { lineId: `${productId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, productId, quantity, setup },
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      count: state.lines.reduce((n, l) => n + l.quantity, 0),
      totals: calcTotals(state.lines, state.discountCode),
      discountCode: state.discountCode,
      ready,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      setQuantity: (lineId, quantity) => dispatch({ type: "qty", lineId, quantity }),
      removeLine: (lineId) => dispatch({ type: "remove", lineId }),
      applyDiscount: (code) => dispatch({ type: "discount", code }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state, ready, drawerOpen, addItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
