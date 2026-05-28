import * as api from 'src/services';

export function slugifyPoojaName(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Slug candidates aligned with /product/puja-kit-* catalog URLs */
export function getPujaKitSlugCandidates(poojaType) {
  const base = slugifyPoojaName(poojaType);
  if (!base) return [];

  const withoutPujaSuffix = base.replace(/-(puja|pooja)$/, '');

  const candidates = [
    `puja-kit-${base}`,
    `puja-kit-${withoutPujaSuffix}`,
    `${base}-puja-kit`,
    `${withoutPujaSuffix}-puja-kit`,
    base
  ];

  return [...new Set(candidates.filter(Boolean))];
}

export function extractProductsFromListResponse(res) {
  return (
    (Array.isArray(res?.data) && res.data) ||
    (Array.isArray(res?.payload?.products) && res.payload.products) ||
    (Array.isArray(res?.data?.products) && res.data.products) ||
    (Array.isArray(res?.products) && res.products) ||
    []
  );
}

/** Same image source as product cards: images[0].url */
export function getProductImageUrl(product) {
  if (!product) return '';

  const img0 = product.images?.[0];
  if (typeof img0 === 'string' && img0) return img0;
  if (img0?.url) return img0.url;

  if (product.type === 'variable' && product.variant?.images?.[0]) {
    const v0 = product.variant.images[0];
    if (typeof v0 === 'string') return v0;
    if (v0?.url) return v0.url;
  }

  if (Array.isArray(product.variants)) {
    for (const variant of product.variants) {
      const v0 = variant?.images?.[0];
      if (typeof v0 === 'string' && v0) return v0;
      if (v0?.url) return v0.url;
    }
  }

  return '';
}

/**
 * Resolve kit image URL: try product slug(s) first, then catalog search fallback.
 */
export async function fetchPujaKitImageUrl(poojaType) {
  const name = String(poojaType || '').trim();
  if (!name) return '';

  const slugs = getPujaKitSlugCandidates(name);

  for (const slug of slugs) {
    try {
      const res = await api.getProductBySlug(slug);
      const product = res?.data;
      const url = getProductImageUrl(product);
      if (url) return url;
    } catch {
      // try next slug
    }
  }

  try {
    const searchTerms = [`${name} kit`, `${name} puja kit`, name];
    for (const term of searchTerms) {
      const res = await api.getProducts(`?q=${encodeURIComponent(term)}&limit=30`);
      const products = extractProductsFromListResponse(res);

      const kitWithImage = products.find((p) => {
        const label = String(p.name || '').toLowerCase();
        return label.includes('kit') && getProductImageUrl(p);
      });
      if (kitWithImage) return getProductImageUrl(kitWithImage);

      const anyWithImage = products.find((p) => getProductImageUrl(p));
      if (anyWithImage) return getProductImageUrl(anyWithImage);
    }
  } catch {
    // fall through to empty
  }

  return '';
}
