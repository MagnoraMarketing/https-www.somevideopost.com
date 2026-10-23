-- Practical property details per video order, editable by the customer.
--
-- Filled from the listing when the video job imports it (only what the page
-- states), then owned by the customer: their edits are never overwritten by a
-- later import. Additive and nullable — orders without it behave as before,
-- and the app keeps working until this has been applied.
--
-- Not added to video_orders_guard_customer_writes(): customers may edit this
-- field through their own session, like title and caption.

alter table video_orders add column if not exists property_details jsonb;
