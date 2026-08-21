"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Product } from "@/data";
import { Order } from "@/lib/orders";
import { trackAddToCart } from "@/lib/analytics";
import { useAuth } from "@/components/AuthContext";


import {
  addToCart as apiAddToCart,
  getCart as apiGetCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  checkoutCart as apiCheckoutCart,
  type CartItemDTO,
  type CheckoutResponseDTO,
} from "@/lib/cartApi";


// export interface CheckoutOrderResponse {
//   orderId: number;
//   razorpayOrderId: string;
//   amount: number;
//   currency: string;
//   status: string;
// }

import { fetchProducts } from "@/lib/productApi";

export type BagItem = Product & {
  quantity: number;
  cartItemId?: number;
};

type AppContextValue = {
  bag: BagItem[];
  saved: string[];
  hydrated: boolean;

  searchOpen: boolean;
  bagOpen: boolean;
  savedOpen: boolean;

  quickView: Product | null;

  pendingOrder:
    | Omit<Order, "id" | "placedAt" | "status">
    | null;

  cartLoading: boolean;
  cartError: string;

  addToBag: (product: Product, qty?: number) => void;
  removeFromBag: (id: string) => void;
  updateBagQty: (id: string, qty: number) => void;
  clearBag: () => void;


  
  checkoutCart: (
  checkoutData: CheckoutRequest
) => Promise<CheckoutResponseDTO>;

  toggleSaved: (id: string) => void;

  setSearchOpen: (open: boolean) => void;
  setBagOpen: (open: boolean) => void;
  setSavedOpen: (open: boolean) => void;
  setQuickView: (product: Product | null) => void;

  setPendingOrder: (
    order:
      | Omit<Order, "id" | "placedAt" | "status">
      | null
  ) => void;
};

export type CheckoutRequest = {
  fullName: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  couponCode: string | null;
};

const AppContext = createContext<AppContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    return raw
      ? (JSON.parse(raw) as T)
      : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Convert backend CartItemDTO into frontend BagItem.
 */
function bagItemFromCart(
  item: CartItemDTO,
  catalog: Product[]
): BagItem {

  const product = catalog.find(
    (p) => p.variantId === item.variantId
  );

  if (product) {
    return {
      ...product,
      quantity: item.quantity,
      cartItemId: item.cartItemId,
    };
  }

  // Fallback if product catalogue is not loaded yet
  return {
    id: String(item.variantId),
    name: item.productName,
    range: "General",
    format: "General",
    image: "/logo.png",
    descriptor: "",
    goals: [],
    status: "Signature",
    mrp: item.unitPrice,
    price: item.unitPrice,
    isVeg: true,
    inStock: true,
    variantId: item.variantId,
    sku: item.sku,
    quantity: item.quantity,
    cartItemId: item.cartItemId,
  };
}

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, token } = useAuth();

  const authToken = token ?? undefined;

  const [bag, setBag] = useState<BagItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  const [hydrated, setHydrated] = useState(false);

  const [cartLoading, setCartLoading] =
    useState(false);

  const [cartError, setCartError] =
    useState("");

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [bagOpen, setBagOpen] =
    useState(false);

  const [savedOpen, setSavedOpen] =
    useState(false);

  const [quickView, setQuickView] =
    useState<Product | null>(null);

  const [pendingOrder, setPendingOrder] =
    useState<
      Omit<Order, "id" | "placedAt" | "status"> | null
    >(null);

  const catalogRef =
    useRef<Product[]>([]);


  // ============================================================
  // INITIAL HYDRATION
  // ============================================================

  useEffect(() => {

    const rawBag =
      readStorage<BagItem[]>("ps_bag", []);

    setBag(
      rawBag
        .filter(
          (p) =>
            p &&
            p.id &&
            p.price != null
        )
        .map((p) => ({
          ...p,
          quantity: p.quantity ?? 1,
        }))
    );

    setSaved(
      readStorage<string[]>(
        "ps_saved",
        []
      )
    );


    // Load catalogue
    fetchProducts()
      .then((products) => {
        catalogRef.current = products;
      })
      .catch(() => {
        // Product API error handled separately
      });


    setHydrated(true);

  }, []);


  // ============================================================
  // LOAD CURRENT USER CART
  // ============================================================

  useEffect(() => {

    if (!hydrated) {
      return;
    }

    // User is not logged in
    if (!user) {

      setBag([]);
      setCartLoading(false);
      setCartError("");

      return;
    }


    if (!authToken) {

      setCartLoading(false);

      return;
    }


    let cancelled = false;

    setCartLoading(true);
    setCartError("");


    apiGetCart(authToken)

      .then((cart) => {

        if (cancelled) {
          return;
        }

        const items =
          cart?.items ?? [];

        setBag(
          items.map((item) =>
            bagItemFromCart(
              item,
              catalogRef.current
            )
          )
        );

      })

      .catch((err: unknown) => {

        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Failed to load cart.";

        /*
         * A new user may not have a cart row yet.
         */
        if (
          /cart not found/i.test(message)
        ) {

          setBag([]);
          setCartError("");

        } else {

          setCartError(message);

        }

      })

      .finally(() => {

        if (!cancelled) {
          setCartLoading(false);
        }

      });


    return () => {
      cancelled = true;
    };

  }, [
    hydrated,
    user,
    authToken,
  ]);


  // ============================================================
  // LOCAL STORAGE
  // ============================================================

  useEffect(() => {

    if (!hydrated) {
      return;
    }

    try {

      localStorage.setItem(
        "ps_bag",
        JSON.stringify(bag)
      );

    } catch {}

  }, [bag, hydrated]);


  useEffect(() => {

    if (!hydrated) {
      return;
    }

    try {

      localStorage.setItem(
        "ps_saved",
        JSON.stringify(saved)
      );

    } catch {}

  }, [saved, hydrated]);


  // ============================================================
  // APP VALUE
  // ============================================================

  const value = useMemo<AppContextValue>(
    () => ({

      bag,
      saved,

      hydrated,

      searchOpen,
      bagOpen,
      savedOpen,

      quickView,

      pendingOrder,

      cartLoading,
      cartError,


      // ========================================================
      // ADD TO CART
      // ========================================================

      addToBag: (
        product,
        qty = 1
      ) => {

        if (qty <= 0) {
          return;
        }


        // ------------------------------------------------------
        // GUEST USER
        // ------------------------------------------------------

        if (!user) {

          setBag((current) => {

            const existing =
              current.find(
                (item) =>
                  item.id === product.id
              );

            if (existing) {

              return current.map(
                (item) =>
                  item.id === product.id
                    ? {
                        ...item,
                        quantity:
                          Math.min(
                            10,
                            item.quantity + qty
                          ),
                      }
                    : item
              );

            }

            return [
              ...current,
              {
                ...product,
                quantity:
                  Math.min(10, qty),
              },
            ];

          });

          setBagOpen(true);

          trackAddToCart(product);

          return;
        }


        // ------------------------------------------------------
        // LOGGED-IN USER
        // ------------------------------------------------------

        const variantId =
          product.variantId ??
          Number(product.id);

        if (!variantIdValid(variantId)) {

          setCartError(
            "Invalid product variant."
          );

          return;
        }


        if (!authToken) {

          setCartError(
            "Authentication token missing."
          );

          return;
        }


        setCartError("");
        setCartLoading(true);


        apiAddToCart(
          variantId,
          qty,
          authToken
        )

          .then(() =>
            apiGetCart(authToken)
          )

          .then((cart) => {

            setBag(
              (cart?.items ?? []).map(
                (item) =>
                  bagItemFromCart(
                    item,
                    catalogRef.current
                  )
              )
            );

            setBagOpen(true);

            trackAddToCart(product);

          })

          .catch((err: unknown) => {

            setCartError(
              err instanceof Error
                ? err.message
                : "Failed to add item to cart."
            );

          })

          .finally(() => {
            setCartLoading(false);
          });

      },


      // ========================================================
      // REMOVE ITEM
      // ========================================================

      removeFromBag: (id) => {

        const item =
          bag.find(
            (b) => b.id === id
          );

        if (!item) {
          return;
        }


        // Guest
        if (!user) {

          setBag((current) =>
            current.filter(
              (item) =>
                item.id !== id
            )
          );

          return;
        }


        if (
          item.cartItemId === undefined ||
          !authToken
        ) {
          return;
        }


        setCartLoading(true);
        setCartError("");


        apiRemoveCartItem(
          item.cartItemId,
          authToken
        )

          .then(() =>
            apiGetCart(authToken)
          )

          .then((cart) => {

            setBag(
              (cart?.items ?? []).map(
                (line) =>
                  bagItemFromCart(
                    line,
                    catalogRef.current
                  )
              )
            );

          })

          .catch((err: unknown) => {

            setCartError(
              err instanceof Error
                ? err.message
                : "Failed to remove item."
            );

          })

          .finally(() => {
            setCartLoading(false);
          });

      },


      // ========================================================
      // UPDATE QUANTITY
      // ========================================================

      updateBagQty: (
        id,
        qty
      ) => {

        if (qty < 1) {

          const item =
            bag.find(
              (b) => b.id === id
            );

          if (
            user &&
            item?.cartItemId !== undefined &&
            authToken
          ) {

            apiRemoveCartItem(
              item.cartItemId,
              authToken
            )
              .then(() =>
                apiGetCart(authToken)
              )
              .then((cart) => {

                setBag(
                  (cart?.items ?? []).map(
                    (line) =>
                      bagItemFromCart(
                        line,
                        catalogRef.current
                      )
                  )
                );

              })
              .catch((err: unknown) => {

                setCartError(
                  err instanceof Error
                    ? err.message
                    : "Failed to remove item."
                );

              });

          } else {

            setBag((current) =>
              current.filter(
                (item) =>
                  item.id !== id
              )
            );

          }

          return;
        }


        const quantity =
          Math.min(10, qty);


        // Guest
        if (!user) {

          setBag((current) =>
            current.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity,
                    }
                  : item
            )
          );

          return;
        }


        const item =
          bag.find(
            (b) => b.id === id
          );


        if (
          !item ||
          item.cartItemId === undefined ||
          !authToken
        ) {
          return;
        }


        setCartLoading(true);
        setCartError("");


        apiUpdateCartItem(
          item.cartItemId,
          quantity,
          authToken
        )

          .then(() =>
            apiGetCart(authToken)
          )

          .then((cart) => {

            setBag(
              (cart?.items ?? []).map(
                (line) =>
                  bagItemFromCart(
                    line,
                    catalogRef.current
                  )
              )
            );

          })

          .catch((err: unknown) => {

            setCartError(
              err instanceof Error
                ? err.message
                : "Failed to update cart."
            );

          })

          .finally(() => {
            setCartLoading(false);
          });

      },


      // ========================================================
      // CLEAR CART
      // ========================================================

      clearBag: () => {

        if (!user) {

          setBag([]);

          return;
        }


        if (!authToken) {
          return;
        }


        setCartLoading(true);
        setCartError("");


        apiClearCart(authToken)

          .then(() => {
            setBag([]);
          })

          .catch((err: unknown) => {

            setCartError(
              err instanceof Error
                ? err.message
                : "Failed to clear cart."
            );

          })

          .finally(() => {
            setCartLoading(false);
          });

      },


      // ========================================================
      // CHECKOUT
      // ========================================================

  checkoutCart: async (checkoutData) => {

  if (!user) {
    throw new Error(
      "Please login before checkout."
    );
  }

  if (!authToken) {
    throw new Error(
      "Authentication token missing."
    );
  }

  setCartError("");
  setCartLoading(true);

  try {

    const order = await apiCheckoutCart(
        checkoutData,
        authToken
    );

    //setBag([]);

    return order;

  } catch (err: unknown) {

    const message =
      err instanceof Error
        ? err.message
        : "Checkout failed.";

    setCartError(message);

    throw err;

  } finally {

    setCartLoading(false);

  }
},

      // ========================================================
      // SAVED
      // ========================================================

      toggleSaved: (id) => {

        setSaved((current) =>
          current.includes(id)
            ? current.filter(
                (item) => item !== id
              )
            : [...current, id]
        );

      },


      setSearchOpen,
      setBagOpen,
      setSavedOpen,
      setQuickView,
      setPendingOrder,

    }),
    [
      bag,
      saved,
      hydrated,

      searchOpen,
      bagOpen,
      savedOpen,

      quickView,
      pendingOrder,

      cartLoading,
      cartError,

      user,
      authToken,
    ]
  );


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


function variantIdValid(
  variantId: number
): boolean {

  return (
    Number.isFinite(variantId) &&
    variantId > 0
  );
}


export function useApp() {

  const context =
    useContext(AppContext);

  if (!context) {

    throw new Error(
      "useApp must be used within AppProvider"
    );

  }

  return context;
}

