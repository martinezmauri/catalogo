-- ═══════════════════════════════════════════════════════════════
-- Datos de ejemplo — Ejecutar DESPUÉS del schema.sql
-- ═══════════════════════════════════════════════════════════════

-- ── Marcas ────────────────────────────────────
INSERT INTO public.brands (name, sort_order) VALUES
  ('Nestlé',    1),
  ('Arcor',     2),
  ('Unilever',  3),
  ('Bonafide',  4),
  ('Hileret',   5);

-- ── Categorías ────────────────────────────────
INSERT INTO public.categories (name, sort_order) VALUES
  ('Cafés',         1),
  ('Chocolates',    2),
  ('Limpieza',      3),
  ('Edulcorantes',  4),
  ('Galletitas',    5);

-- ── Productos de ejemplo ──────────────────────
INSERT INTO public.products (brand_id, category_id, name, presentation, price, units_per_pack, pack_label)
SELECT b.id, c.id, p.name, p.presentation, p.price, p.units_per_pack, p.pack_label
FROM (VALUES
  ('Nestlé', 'Cafés',        'Nescafé Clásico',         '170 gr',   4500, 12, 'caja'),
  ('Nestlé', 'Cafés',        'Nescafé Dolca',           '170 gr',   4200, 12, 'caja'),
  ('Nestlé', 'Chocolates',   'Nesquik Cacao en Polvo',  '360 gr',   3800, 12, 'caja'),
  ('Nestlé', 'Chocolates',   'Kit Kat',                 '41.5 gr',  1200, 24, 'caja'),
  ('Arcor',  'Chocolates',   'Bon o Bon',               '450 gr',   5200, 6,  'bulto'),
  ('Arcor',  'Galletitas',   'Maná Clásica',            '200 gr',    850, 24, 'caja'),
  ('Arcor',  'Galletitas',   'Formitas',                '150 gr',    720, 36, 'caja'),
  ('Unilever','Limpieza',    'Skip Líquido',            '3 L',      8500, 4,  'bulto'),
  ('Unilever','Limpieza',    'Cif Crema',               '750 ml',   2800, 12, 'caja'),
  ('Unilever','Limpieza',    'Ala Jabón en Polvo',      '800 gr',   3200, 10, 'bulto'),
  ('Bonafide','Chocolates',  'Bombon Escocés',          '30 gr',     600, 30, 'caja'),
  ('Bonafide','Cafés',       'Café Bonafide Torrado',   '250 gr',   3500, 12, 'caja'),
  ('Hileret', 'Edulcorantes','Hileret Classic x200',    '200 sobres',2400, 12, 'caja'),
  ('Hileret', 'Edulcorantes','Hileret Stevia x50',      '50 sobres', 1800, 24, 'caja')
) AS p(brand_name, category_name, name, presentation, price, units_per_pack, pack_label)
JOIN public.brands b ON b.name = p.brand_name
JOIN public.categories c ON c.name = p.category_name;
