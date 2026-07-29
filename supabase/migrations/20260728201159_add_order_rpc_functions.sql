/*
# Add RPC functions for order placement

## Purpose
Two server-side functions used by the place-order edge function to safely
mutate data that should not be done directly from the client:

1. `decrement_stock` — reduces product stock by a quantity, flooring at 0.
   Prevents overselling by running atomically.
2. `increment_coupon_usage` — bumps the used_count on a coupon by 1.

## New Functions
- `decrement_stock(product_id_input uuid, qty_input int)` → void
- `increment_coupon_usage(code_input text)` → void

## Security
- Both functions are SECURITY DEFINER so the edge function (service role) can
  call them. They only perform the narrow mutation described above.
- No direct table access is granted to anon/authenticated beyond existing RLS.
*/

CREATE OR REPLACE FUNCTION decrement_stock(product_id_input uuid, qty_input int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - qty_input)
  WHERE id = product_id_input;
END;
$$;

CREATE OR REPLACE FUNCTION increment_coupon_usage(code_input text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE coupons
  SET used_count = used_count + 1
  WHERE code = UPPER(code_input);
END;
$$;
