INSERT INTO "stocks" (product_id, quantity, price)
VALUES
    ('3274080005003', 100, 20),
    ('0737628064502', 50, 13)
ON CONFLICT (product_id) DO NOTHING;