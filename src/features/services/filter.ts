import type { DocumentType, Service, ServiceCategory, TrainingFormat } from '@/features/services/types';

export type SortMode = 'popular' | 'price_asc' | 'price_desc' | 'duration_asc' | 'new_first';

export type ServiceFilters = {
  query: string;
  category: ServiceCategory | 'all';
  format: TrainingFormat | 'all';
  documentType: DocumentType | 'all';
  minPrice: number;
  maxPrice: number;
  onlyPopular: boolean;
  onlyNew: boolean;
  sort: SortMode;
};

function minHours(service: Service): number {
  return Math.min(...service.variants.map((variant) => variant.hours));
}

export function applyServiceFilters(source: ReadonlyArray<Service>, filters: ServiceFilters): ReadonlyArray<Service> {
  const filtered = source.filter((service) => {
    const matchesCategory = filters.category === 'all' || service.category === filters.category;
    const matchesFormat = filters.format === 'all' || service.formats.includes(filters.format);
    const matchesDocument = filters.documentType === 'all' || service.documentType === filters.documentType;
    const matchesPrice = service.maxPrice >= filters.minPrice && service.minPrice <= filters.maxPrice;
    const matchesPopular = !filters.onlyPopular || service.popularity >= 88;
    const matchesNew = !filters.onlyNew || service.isNew;
    return matchesCategory && matchesFormat && matchesDocument && matchesPrice && matchesPopular && matchesNew;
  });

  return [...filtered].sort((left, right) => {
    if (filters.sort === 'price_asc') return left.minPrice - right.minPrice;
    if (filters.sort === 'price_desc') return right.minPrice - left.minPrice;
    if (filters.sort === 'duration_asc') return minHours(left) - minHours(right);
    if (filters.sort === 'new_first') return Number(right.isNew) - Number(left.isNew) || right.popularity - left.popularity;
    return right.popularity - left.popularity;
  });
}
