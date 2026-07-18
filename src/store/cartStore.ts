import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  mode: "rent" | "sale";
  price: number; // Unit price (sale price or rent price for the duration)
  duration?: number; // Rent duration in days
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, mode: "rent" | "sale", startDate?: string) => void;
  updateQuantity: (productId: string, mode: "rent" | "sale", quantity: number, startDate?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),

      addItem: (newItem) => {
        const items = get().items;
        const quantity = newItem.quantity || 1;

        const existingIndex = items.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            item.mode === newItem.mode &&
            (item.mode === "sale" || item.startDate === newItem.startDate)
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...newItem, quantity } as CartItem] });
        }
      },

      removeItem: (productId, mode, startDate) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.mode === mode &&
                (mode === "sale" || item.startDate === startDate)
              )
          ),
        });
      },

      updateQuantity: (productId, mode, quantity, startDate) => {
        if (quantity <= 0) {
          get().removeItem(productId, mode, startDate);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId &&
            item.mode === mode &&
            (mode === "sale" || item.startDate === startDate)
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "thrithi-cart-storage", // localStorage key
    }
  )
);
