import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';
import { useDispatch, useSelector } from 'react-redux';
import {
  // PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
} from 'src/_mock';
import { EmptyContent } from 'src/components/empty-content';
import { ProductList } from '../product-list';
import { ProductSort } from '../product-sort';
import { CartIcon } from '../components/cart-icon';
import { ProductFilters } from '../product-filters';
import { useCheckoutContext } from '../../checkout/context';
import { ProductFiltersResult } from '../product-filters-result';
import { CustomSearch } from '../CustomSearch';
import { fetchItemsPaginated, DEFAULT_ITEMS_PER_PAGE } from 'src/services/productApi';
import { fetchCategoryListingThunk } from 'src/redux/CategoryListingReducer';
import { Box, ButtonBase, Drawer } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import {
  DUMMY_IMAGE,
  getCategoryDisplayImages,
  handleProductImageError,
  isPlaceholderProductImage,
} from 'src/utils/product-image';
import { useLocation, useNavigate } from 'react-router-dom';

/** Product grid columns when products share the page with the sub category sidebar. */
const SPLIT_GRID_COLUMNS = {
  xs: 'repeat(2, 1fr)',
  sm: 'repeat(3, 1fr)',
  md: 'repeat(3, 1fr)',
  lg: 'repeat(4, 1fr)',
  xl: 'repeat(5, 1fr)',
};

/** Offset (px) below the sticky site header for the sidebar / scroll target. */
const STICKY_TOP_OFFSET = 110;

export function ProductShopView() {
  const dispatch = useDispatch();
  const { data: categories = [] } = useSelector((state) => state.categoryListing);

  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const productsPaneRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const urlSearch = useMemo(
    () => new URLSearchParams(location.search).get('search') || '',
    [location.search]
  );
  const page = useMemo(() => {
    const value = parseInt(new URLSearchParams(location.search).get('page') || '1', 10);
    return Math.max(1, value || 1);
  }, [location.search]);
  const limit = useMemo(() => {
    const value = parseInt(
      new URLSearchParams(location.search).get('limit') || String(DEFAULT_ITEMS_PER_PAGE),
      10
    );
    return Math.max(1, value || DEFAULT_ITEMS_PER_PAGE);
  }, [location.search]);
  const sortBy = useMemo(
    () => new URLSearchParams(location.search).get('sortBy') || 'AtoZ',
    [location.search]
  );
  const subGroup1Param = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || params.get('subGroup1');
  }, [location.search]);

  const subGroup2Param = useMemo(() => {
    const raw = new URLSearchParams(location.search).get('subGroup2') || '';
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return raw.trim();
    }
  }, [location.search]);

  const isSubCategorySelected = (name) => {
    if (!subGroup2Param || !name) return false;
    return subGroup2Param.toLowerCase() === String(name).trim().toLowerCase();
  };

  const shouldDisplaySubGroup2 = subGroup1Param && subGroup1Param !== 'all';

  const PRODUCT_SORT_OPTIONS = [
    { value: 'AtoZ', label: 'A to Z' },
    { value: 'newest', label: 'Newest' },
    { value: 'priceDesc', label: 'Price: High - Low' },
    { value: 'priceAsc', label: 'Price: Low - High' },
  ];

  const checkout = useCheckoutContext?.() || { items: [] };

  const openFilters = useBoolean();
  const openSubCategorySheet = useBoolean();

  const [searchQuery, setSearchQuery] = useState(() => urlSearch);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const locationSearchRef = useRef(location.search);
  locationSearchRef.current = location.search;

  /** Only navigate when query string actually changes (prevents API loop). */
  const updateUrlParams = useCallback((updates, { resetPage = false, push = false } = {}) => {
    const params = new URLSearchParams(locationSearchRef.current);

    if (resetPage) {
      params.delete('page');
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined
        || value === null
        || value === ''
        || value === 'all'
        || (key === 'sortBy' && value === 'AtoZ')
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const nextSearch = params.toString();
    const currentSearch = locationSearchRef.current.startsWith('?')
      ? locationSearchRef.current.slice(1)
      : locationSearchRef.current;

    if (nextSearch === currentSearch) {
      return;
    }

    // push = new history entry (browser Back returns here); replace = silent URL sync
    navigate(
      { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' },
      { replace: !push }
    );
  }, [location.pathname, navigate]);

  const filters = useSetState({
    gender: [],
    colors: [],
    rating: '',
    category: 'all',
    subGroup1: 'all',
    subGroup2: 'all',
  });

  const categoryNames = useMemo(
    () => categories.map((category) => category.name).filter(Boolean),
    [categories]
  );

  const uniqueItemsubGroup1 = useMemo(() => {
    if (filters.state.category === 'all') {
      return categoryNames;
    }
    return categoryNames.filter((name) => name === filters.state.category);
  }, [filters.state.category, categoryNames]);

  const uniqueItemsubGroup2 = useMemo(() => {
    let matchedCategories = categories;

    if (filters.state.category !== 'all') {
      matchedCategories = matchedCategories.filter((category) => category.name === filters.state.category);
    }

    if (filters.state.subGroup1 !== 'all') {
      matchedCategories = matchedCategories.filter((category) => category.name === filters.state.subGroup1);
    }

    return [
      ...new Set(
        matchedCategories.flatMap((category) =>
          (category.subcategories || []).map((subcategory) => subcategory.name)
        )
      ),
    ];
  }, [categories, filters.state.category, filters.state.subGroup1]);

  const filterCategory = filters.state.category;
  const filterSubGroup1 = filters.state.subGroup1;
  const filterSubGroup2 = filters.state.subGroup2;

  const apiSubGroup1 = useMemo(() => {
    if (filterSubGroup1 !== 'all') return filterSubGroup1;
    if (filterCategory !== 'all') return filterCategory;
    return undefined;
  }, [filterSubGroup1, filterCategory]);

  const apiSubGroup2 = useMemo(() => {
    if (filterSubGroup2 !== 'all') return filterSubGroup2;
    return undefined;
  }, [filterSubGroup2]);

  const lastFetchKeyRef = useRef('');
  const hasSyncedLimitRef = useRef(false);
  const skipUrlToInputSyncRef = useRef(false);

  useEffect(() => {
    dispatch(fetchCategoryListingThunk());
  }, [dispatch]);

  // Sync limit into URL once
  useEffect(() => {
    if (hasSyncedLimitRef.current) return;

    const params = new URLSearchParams(location.search);
    if (params.get('limit')) {
      hasSyncedLimitRef.current = true;
      return;
    }

    hasSyncedLimitRef.current = true;
    updateUrlParams({ limit: DEFAULT_ITEMS_PER_PAGE });
  }, [location.search, updateUrlParams]);

  // One-shot search from navigation state (e.g. home search)
  useEffect(() => {
    const term = location.state?.searchTerm;
    if (!term) return;

    skipUrlToInputSyncRef.current = true;
    setSearchQuery(term);
    // Build URL + clear router state in one navigation
    const params = new URLSearchParams(locationSearchRef.current);
    params.delete('page');
    params.set('search', term);
    if (!params.get('limit')) params.set('limit', String(limit));
    const nextSearch = params.toString();
    navigate(
      { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' },
      { replace: true, state: {} }
    );
  }, [location.state?.searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // URL → input (browser back/forward only)
  useEffect(() => {
    if (skipUrlToInputSyncRef.current) {
      skipUrlToInputSyncRef.current = false;
      return;
    }
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
    // intentionally only when URL search changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch]);

  // Debounced input → URL (once per changed query)
  useEffect(() => {
    if (debouncedQuery === urlSearch) return;

    skipUrlToInputSyncRef.current = true;
    updateUrlParams(
      { search: debouncedQuery || undefined, limit },
      { resetPage: true }
    );
  }, [debouncedQuery, urlSearch, limit, updateUrlParams]);

  // Fetch products — only when primitive query params change
  useEffect(() => {
    const search = debouncedQuery?.trim() || '';

    const fetchKey = JSON.stringify({
      page,
      limit,
      search,
      subGroup1: apiSubGroup1 || null,
      subGroup2: apiSubGroup2 || null,
      sortBy,
    });

    if (lastFetchKeyRef.current === fetchKey) {
      return undefined;
    }
    lastFetchKeyRef.current = fetchKey;

    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await fetchItemsPaginated({
          page,
          limit,
          search: search || undefined,
          subGroup1: apiSubGroup1 ? [apiSubGroup1] : undefined,
          subGroup2: apiSubGroup2 ? [apiSubGroup2] : undefined,
          sortBy: sortBy !== 'AtoZ' ? sortBy : undefined,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setProducts(result.data || []);
        setTotalResults(result.total || 0);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        if (controller.signal.aborted || error?.name === 'CanceledError') return;
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotalResults(0);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [page, limit, debouncedQuery, apiSubGroup1, apiSubGroup2, sortBy]);

  const sortedSubGroup2List = useMemo(() => {
    if (!shouldDisplaySubGroup2 || !subGroup1Param) return [];

    const category = categories.find((item) => item.name === subGroup1Param);
    return (category?.subcategories || [])
      .map((subcategory) => ({
        name: subcategory.name,
        images: getCategoryDisplayImages(
          subcategory.image && !isPlaceholderProductImage(subcategory.image)
            ? [subcategory.image]
            : []
        ),
      }))
      .filter((subcategory) => subcategory.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [shouldDisplaySubGroup2, subGroup1Param, categories]);

  const showSplitLayout = shouldDisplaySubGroup2 && sortedSubGroup2List.length > 0;

  const canReset =
    filters.state.gender.length > 0 ||
    filters.state.colors.length > 0 ||
    filters.state.rating !== '' ||
    filterCategory !== 'all' ||
    filterSubGroup1 !== 'all' ||
    filterSubGroup2 !== 'all';

  const notFound = !products.length && canReset && !loading;

  /** Bring the products pane into view if its top has scrolled off-screen. */
  const revealProductsPane = useCallback(() => {
    const pane = productsPaneRef.current;
    if (!pane) return;
    const { top } = pane.getBoundingClientRect();
    if (top < STICKY_TOP_OFFSET || top > window.innerHeight * 0.6) {
      pane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSortBy = useCallback((newValue) => {
    updateUrlParams({ sortBy: newValue, limit }, { resetPage: true });
  }, [updateUrlParams, limit]);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    // Push each page into history so browser Back goes 4 → 3 → 2 → 1, not straight to Home
    updateUrlParams(
      {
        page: newPage > 1 ? newPage : undefined,
        limit,
      },
      { push: true }
    );
    if (productsPaneRef.current) {
      productsPaneRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [updateUrlParams, limit]);

  const productsEmpty = !loading && !products?.length && !canReset;
  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <CustomSearch
        value={searchQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            colors: PRODUCT_COLOR_OPTIONS,
            ratings: PRODUCT_RATING_OPTIONS,
            genders: PRODUCT_GENDER_OPTIONS,
            categories: ['all', ...categoryNames],
            subGroups1: ['all', ...uniqueItemsubGroup1],
            subGroups2: ['all', ...uniqueItemsubGroup2],
          }}
        />

        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  /** Select a sub category (or null for "All") — products update in the right pane. */
  const handleSubCategoryClick = (subGroup2Name) => {
    const params = new URLSearchParams(location.search);
    if (subGroup2Name) {
      params.set('subGroup2', subGroup2Name);
    } else {
      params.delete('subGroup2');
    }
    params.delete('page');
    params.set('limit', String(limit));
    navigate(`/product?${params.toString()}`);
    openSubCategorySheet.onFalse();
    revealProductsPane();
  };

  const selectedSubCategoryLabel = subGroup2Param
    ? sortedSubGroup2List.find((s) => isSubCategorySelected(s.name))?.name || subGroup2Param
    : 'All Sub Categories';

  /** Sub category rows — shared by the desktop sidebar and the mobile bottom sheet. */
  const renderSubCategoryItems = [{ name: null, images: [] }, ...sortedSubGroup2List].map(
    (subcategory) => {
      const selected = subcategory.name
        ? isSubCategorySelected(subcategory.name)
        : !subGroup2Param;
      const thumb = subcategory.images?.[0];
      return (
        <Box
          key={subcategory.name || '__all__'}
          role="button"
          tabIndex={0}
          aria-pressed={selected}
          onClick={() => handleSubCategoryClick(subcategory.name)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSubCategoryClick(subcategory.name);
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            flexShrink: 0,
            px: 1.25,
            py: 1,
            minHeight: 48,
            borderRadius: 1,
            cursor: 'pointer',
            bgcolor: selected ? '#111' : 'transparent',
            color: selected ? '#fff' : '#222',
            fontWeight: selected ? 700 : 500,
            transition: 'background 0.15s ease, color 0.15s ease',
            '&:hover': {
              bgcolor: selected ? '#111' : 'rgba(255, 102, 0, 0.1)',
            },
          }}
        >
          {subcategory.name ? (
            <Box
              component="img"
              src={thumb || DUMMY_IMAGE}
              alt=""
              onError={handleProductImageError}
              sx={{
                width: 36,
                height: 36,
                objectFit: 'contain',
                bgcolor: '#fff',
                borderRadius: 0.75,
                border: '1px solid rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}
            />
          ) : (
            <Box
              sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:list-bold" width={22} />
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{ flex: 1, fontWeight: 'inherit', color: 'inherit', lineHeight: 1.3 }}
          >
            {subcategory.name || 'All Sub Categories'}
          </Typography>
          {selected && (
            <Iconify icon="eva:checkmark-fill" width={18} sx={{ color: '#FF6600', flexShrink: 0 }} />
          )}
        </Box>
      );
    }
  );

  /** Mobile: sticky selector bar + bottom sheet (replaces the sidebar below md). */
  const renderMobileSubCategoryPicker = (
    <>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 5,
          width: '100%',
          py: 1,
          bgcolor: 'background.default',
        }}
      >
        <ButtonBase
          onClick={openSubCategorySheet.onTrue}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.25,
            borderRadius: 1.5,
            border: '1.5px solid #FF6600',
            bgcolor: '#fff',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Iconify icon="solar:list-bold" width={20} sx={{ color: '#FF6600', flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
              {subGroup1Param}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
              {selectedSubCategoryLabel}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#FF6600', fontWeight: 700, flexShrink: 0 }}>
            Change
          </Typography>
          <Iconify icon="eva:arrow-ios-downward-fill" width={18} sx={{ color: '#FF6600', flexShrink: 0 }} />
        </ButtonBase>
      </Box>

      <Drawer
        anchor="bottom"
        open={openSubCategorySheet.value}
        onClose={openSubCategorySheet.onFalse}
        PaperProps={{
          sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '75vh' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.2)' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #eee',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              Sub Categories
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap component="div">
              {subGroup1Param} · {sortedSubGroup2List.length}
            </Typography>
          </Box>
          <ButtonBase onClick={openSubCategorySheet.onFalse} sx={{ p: 1, borderRadius: '50%' }} aria-label="Close">
            <Iconify icon="mingcute:close-line" width={22} />
          </ButtonBase>
        </Box>
        <Box sx={{ overflowY: 'auto', p: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {renderSubCategoryItems}
        </Box>
      </Drawer>
    </>
  );

  const renderResults = (
    <ProductFiltersResult filters={filters} totalResults={totalResults} />
  );
  const renderNotFound = <EmptyContent filled sx={{ py: 10 }} />;

  const renderSubCategorySidebar = (
    <Box
      component="aside"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: 260,
        flexShrink: 0,
        position: { md: 'sticky' },
        top: { md: STICKY_TOP_OFFSET },
        border: '1px solid #eee',
        borderRadius: 1.5,
        bgcolor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, py: 1.5, bgcolor: '#FF6600', color: '#fff' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          Sub Categories
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }} noWrap component="div">
          {subGroup1Param}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          maxHeight: `calc(100vh - ${STICKY_TOP_OFFSET + 90}px)`,
          p: 1,
          gap: 0.5,
        }}
      >
        {renderSubCategoryItems}
      </Box>
    </Box>
  );

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout?.items?.length || 0} />
      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {!subGroup1Param && canReset && renderResults}
      </Stack>

      {showSplitLayout ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'flex-start',
            gap: { xs: 2, md: 3 },
          }}
        >
          {/* LEFT: Sub categories (sticky so they stay in view while browsing products) */}
          {renderSubCategorySidebar}
          {renderMobileSubCategoryPicker}

          {/* RIGHT: Products of the selected sub category */}
          <Box
            ref={productsPaneRef}
            sx={{ flex: 1, minWidth: 0, width: '100%', scrollMarginTop: `${STICKY_TOP_OFFSET}px` }}
          >
            {(notFound || productsEmpty) && renderNotFound}
            <ProductList
              products={products}
              loading={loading}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              gridColumns={SPLIT_GRID_COLUMNS}
            />
          </Box>
        </Box>
      ) : (
        <>
          {(notFound || productsEmpty) && renderNotFound}
          <ProductList
            products={products}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
}
