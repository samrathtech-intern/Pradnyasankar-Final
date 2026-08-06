USE pradnyasanskar;

SET @tax_12 = (SELECT id FROM tax_classes WHERE name = 'GST 12% (Ayurvedic - Placeholder)');
SET @tax_18 = (SELECT id FROM tax_classes WHERE name = 'GST 18% (Nutraceutical - Placeholder)');

INSERT INTO tax_classes (id, name, rate)
SELECT UUID(), 'GST 12% (Ayurvedic - Placeholder)', 12.00
WHERE @tax_12 IS NULL;

INSERT INTO tax_classes (id, name, rate)
SELECT UUID(), 'GST 18% (Nutraceutical - Placeholder)', 18.00
WHERE @tax_18 IS NULL;

SET @tax_12 = (SELECT id FROM tax_classes WHERE name = 'GST 12% (Ayurvedic - Placeholder)');
SET @tax_18 = (SELECT id FROM tax_classes WHERE name = 'GST 18% (Nutraceutical - Placeholder)');

SET @cat_ayurveda = UUID();
SET @cat_nutra    = UUID();
SET @cat_ayu_caps = UUID();
SET @cat_ayu_oils = UUID();
SET @cat_ayu_drops= UUID();
SET @cat_ayu_form = UUID();
SET @cat_nut_tabs = UUID();
SET @cat_nut_caps = UUID();

INSERT INTO categories (id, name, parent_category_id) VALUES
  (@cat_ayurveda, 'Ayurveda', NULL),
  (@cat_nutra,    'Nutraceuticals', NULL),
  (@cat_ayu_caps, 'Ayurvedic Capsules', @cat_ayurveda),
  (@cat_ayu_oils, 'Ayurvedic Oils & Topical', @cat_ayurveda),
  (@cat_ayu_drops,'Ayurvedic Drops & Roll-On', @cat_ayurveda),
  (@cat_ayu_form, 'Ayurvedic Formulations', @cat_ayurveda),
  (@cat_nut_tabs, 'Nutraceutical Tablets', @cat_nutra),
  (@cat_nut_caps, 'Nutraceutical Capsules', @cat_nutra);

SET @p001 = UUID();
SET @p002 = UUID();
SET @p003 = UUID();
SET @p004 = UUID();
SET @p005 = UUID();
SET @p006 = UUID();
SET @p007 = UUID();
SET @p008 = UUID();
SET @p009 = UUID();
SET @p010 = UUID();
SET @p011 = UUID();
SET @p012 = UUID();
SET @p013 = UUID();
SET @p014 = UUID();
SET @p015 = UUID();
SET @p016 = UUID();
SET @p017 = UUID();
SET @p018 = UUID();
SET @p019 = UUID();
SET @p020 = UUID();
SET @p021 = UUID();
SET @p022 = UUID();
SET @p023 = UUID();
SET @p024 = UUID();
SET @p025 = UUID();
SET @p026 = UUID();
SET @p027 = UUID();
SET @p028 = UUID();
SET @p029 = UUID();
SET @p030 = UUID();
SET @p031 = UUID();
SET @p032 = UUID();
SET @p033 = UUID();
SET @p034 = UUID();
SET @p035 = UUID();
SET @p036 = UUID();
SET @p037 = UUID();
SET @p038 = UUID();
SET @p039 = UUID();
SET @p040 = UUID();
SET @p041 = UUID();
SET @p042 = UUID();
SET @p043 = UUID();
SET @p044 = UUID();
SET @p045 = UUID();
SET @p046 = UUID();
SET @p047 = UUID();

INSERT INTO products (id, category_id, tax_class_id, name, slug, base_price, is_active) VALUES
  (@p001, @cat_nut_tabs, @tax_18, 'Calcium Vit. D3 tablet', 'calcium-vit-d3-tablet', 80.00, TRUE),
  (@p002, @cat_nut_tabs, @tax_18, 'Multi Vit. Tablet', 'multi-vit-tablet', 80.00, TRUE),
  (@p003, @cat_nut_tabs, @tax_18, 'Glutaedge Tablet', 'glutaedge-tablet', 125.00, TRUE),
  (@p004, @cat_ayu_form, @tax_12, 'Apple Cider Vinegar', 'apple-cider-vinegar', 85.00, TRUE),
  (@p005, @cat_nut_caps, @tax_18, 'Ganoderma Capsule', 'ganoderma-capsule', 110.00, TRUE),
  (@p006, @cat_nut_caps, @tax_18, 'Seabhukthron Capsule', 'seabhukthron-capsule', 110.00, TRUE),
  (@p007, @cat_nut_caps, @tax_18, 'Plant Vit. B12 Capsule', 'plant-vit-b12-capsule', 70.00, TRUE),
  (@p008, @cat_nut_caps, @tax_18, 'Omega 3 6 9 capsule', 'omega-3-6-9-capsule', 90.00, TRUE),
  (@p009, @cat_nut_caps, @tax_18, 'Spirullina Capsule', 'spirullina-capsule', 65.00, TRUE),
  (@p010, @cat_nut_caps, @tax_18, 'Colostrum Capsule', 'colostrum-capsule', 140.00, TRUE),
  (@p011, @cat_nut_caps, @tax_18, 'Glucosamine Capsule', 'glucosamine-capsule', 65.00, TRUE),
  (@p012, @cat_nut_caps, @tax_18, 'Men''s 30 plus Capsule', 'men-s-30-plus-capsule', 82.00, TRUE),
  (@p013, @cat_nut_caps, @tax_18, 'Omega plus Capsule', 'omega-plus-capsule-1gm', 160.00, TRUE),
  (@p014, @cat_nut_caps, @tax_18, 'Reno Clean Capsule', 'reno-clean-capsule', 72.00, TRUE),
  (@p015, @cat_nut_caps, @tax_18, 'All Total Capsule', 'all-total-capsule', 135.00, TRUE),
  (@p016, @cat_nut_caps, @tax_18, 'Miracle Berry Capsule', 'miracle-berry-capsule', 150.00, TRUE),
  (@p017, @cat_nut_caps, @tax_18, 'N Vigor Capsule', 'n-vigor-capsule', 115.00, TRUE),
  (@p018, @cat_nut_caps, @tax_18, 'Women''s Health Plus Capsule', 'women-s-health-plus-capsule', 72.00, TRUE),
  (@p019, @cat_nut_caps, @tax_18, 'Pilo Care Capsule', 'pilo-care-capsule', 72.00, TRUE),
  (@p020, @cat_nut_caps, @tax_18, 'Liver Care Capsule', 'liver-care-capsule', 72.00, TRUE),
  (@p021, @cat_nut_caps, @tax_18, 'Omega 3 Capsule', 'omega-3-capsule', 140.00, TRUE),
  (@p022, @cat_nut_caps, @tax_18, 'Detox Capsule', 'detox-capsule', 80.00, TRUE),
  (@p023, @cat_nut_caps, @tax_18, 'Berry Plus Capsule', 'berry-plus-capsule', 150.00, TRUE),
  (@p024, @cat_ayu_caps, @tax_12, 'Neem Capsule', 'neem-capsule', 68.00, TRUE),
  (@p025, @cat_ayu_caps, @tax_12, 'Ashwagandha Capsule', 'ashwagandha-capsule', 76.00, TRUE),
  (@p026, @cat_ayu_caps, @tax_12, 'Papaya Capsule', 'papaya-capsule', 71.00, TRUE),
  (@p027, @cat_ayu_caps, @tax_12, 'Tulsi Capsule', 'tulsi-capsule', 65.00, TRUE),
  (@p028, @cat_ayu_caps, @tax_12, 'Amla Capsule', 'amla-capsule', 54.00, TRUE),
  (@p029, @cat_nut_caps, @tax_18, 'Care 4 All Capsule', 'care-4-all-capsule', 98.00, TRUE),
  (@p030, @cat_ayu_caps, @tax_12, 'Shilajjeet Capsule', 'shilajjeet-capsule', 82.00, TRUE),
  (@p031, @cat_ayu_caps, @tax_12, 'Wheat Grass Capsule', 'wheat-grass-capsule', 72.00, TRUE),
  (@p032, @cat_ayu_caps, @tax_12, 'Jestmadh Capsule', 'jestmadh-capsule', 72.00, TRUE),
  (@p033, @cat_ayu_caps, @tax_12, 'Bramhi Capsule', 'bramhi-capsule', 87.00, TRUE),
  (@p034, @cat_nut_caps, @tax_18, 'Sleep Enhancer Capsule', 'sleep-enhancer-capsule', 110.00, TRUE),
  (@p035, @cat_ayu_caps, @tax_12, 'Moringa Capsule', 'moringa-capsule', 79.00, TRUE),
  (@p036, @cat_ayu_caps, @tax_12, 'Aloevera Capsule', 'aloevera-capsule', 67.00, TRUE),
  (@p037, @cat_nut_caps, @tax_18, 'Blue Berry Capsule', 'blue-berry-capsule', 164.00, TRUE),
  (@p038, @cat_ayu_caps, @tax_12, 'Garlic Capsule', 'garlic-capsule', 76.00, TRUE),
  (@p039, @cat_ayu_caps, @tax_12, 'Curcumin (95%) Capsule', 'curcumin-95-capsule', 170.00, TRUE),
  (@p040, @cat_nut_caps, @tax_18, 'Diaba Touch Capsule', 'diaba-touch-capsule', 62.00, TRUE),
  (@p041, @cat_ayu_oils, @tax_12, 'Nabhi Oil', 'nabhi-oil-30ml', 60.00, TRUE),
  (@p042, @cat_ayu_form, @tax_12, 'Shatavari Kalp', 'shatavari-kalp-250gm', 120.00, TRUE),
  (@p043, @cat_ayu_drops, @tax_12, 'Tulsi Drop', 'tulsi-drop', 54.00, TRUE),
  (@p044, @cat_ayu_oils, @tax_12, 'Pain Oil', 'pain-oil', 45.00, TRUE),
  (@p045, @cat_ayu_oils, @tax_12, 'Hair Oil', 'hair-oil', 62.00, TRUE),
  (@p046, @cat_ayu_oils, @tax_12, 'Massage Oil', 'massage-oil', 72.00, TRUE),
  (@p047, @cat_ayu_drops, @tax_12, 'Amrutdhara Roll on', 'amrutdhara-roll-on-15ml', 24.00, TRUE);

INSERT INTO product_variants (id, product_id, sku, price, stock_quantity, attributes) VALUES (UUID(), @p013, 'PSN-013-V1', 160.00, 0, JSON_OBJECT('pack_size', '1gm'));
INSERT INTO product_variants (id, product_id, sku, price, stock_quantity, attributes) VALUES (UUID(), @p041, 'PSN-041-V1', 60.00, 0, JSON_OBJECT('pack_size', '30ml'));
INSERT INTO product_variants (id, product_id, sku, price, stock_quantity, attributes) VALUES (UUID(), @p042, 'PSN-042-V1', 120.00, 0, JSON_OBJECT('pack_size', '250gm'));
INSERT INTO product_variants (id, product_id, sku, price, stock_quantity, attributes) VALUES (UUID(), @p047, 'PSN-047-V1', 24.00, 0, JSON_OBJECT('pack_size', '15ml'));

INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p001, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p002, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p003, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p004, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p005, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p006, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p007, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p008, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p009, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p010, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p011, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p012, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p013, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p014, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p015, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p016, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p017, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p018, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p019, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p020, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p021, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p022, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p023, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p024, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p025, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p026, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p027, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p028, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p029, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p030, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p031, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p032, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p033, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p034, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p035, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p036, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p037, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p038, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p039, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p040, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p041, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p042, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p043, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p044, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p045, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p046, 0, 'initial_catalogue_import');
INSERT INTO stock_ledger (id, product_id, quantity_change, reason) VALUES (UUID(), @p047, 0, 'initial_catalogue_import');