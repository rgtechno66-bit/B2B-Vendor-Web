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
import { Box, Button, Grid, LinearProgress } from '@mui/material';
import { getCategoryDisplayImages, isPlaceholderProductImage } from 'src/utils/product-image';
import { useLocation, useNavigate } from 'react-router-dom';
import { CourseWidgetSummaryData } from '../components/course-widget-summary';

/** Change only this to update subcategory image rotation interval (milliseconds). */
const SUBCATEGORY_IMAGE_CHANGE_INTERVAL_MS = 5000;

export function ProductShopView() {
  const dispatch = useDispatch();
  const { data: categories = [] } = useSelector((state) => state.categoryListing);

  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [visibleSubGroup2, setVisibleSubGroup2] = useState(18);
  const ITEMS_PER_LOAD = 18;

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

  const [searchQuery, setSearchQuery] = useState(() => urlSearch);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const locationSearchRef = useRef(location.search);
  locationSearchRef.current = location.search;

  /** Only navigate when query string actually changes (prevents API loop). */
  const updateUrlParams = useCallback((updates, { resetPage = false } = {}) => {
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

    navigate(
      { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' },
      { replace: true }
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

  const canReset =
    filters.state.gender.length > 0 ||
    filters.state.colors.length > 0 ||
    filters.state.rating !== '' ||
    filterCategory !== 'all' ||
    filterSubGroup1 !== 'all' ||
    filterSubGroup2 !== 'all';

  const notFound = !products.length && canReset && !loading;

  const handleSortBy = useCallback((newValue) => {
    updateUrlParams({ sortBy: newValue, limit }, { resetPage: true });
  }, [updateUrlParams, limit]);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    updateUrlParams({
      page: newPage > 1 ? newPage : undefined,
      limit,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleProductClick = (subGroup2Name) => {
    const params = new URLSearchParams(location.search);
    params.set('subGroup2', subGroup2Name);
    params.delete('page');
    params.set('limit', String(limit));
    navigate(`/product?${params.toString()}`);
  };

  const renderResults = (
    <ProductFiltersResult filters={filters} totalResults={totalResults} />
  );
  const renderNotFound = <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout?.items?.length || 0} />
      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }} >
        {renderFilters}

        {!subGroup1Param && canReset && renderResults}

        {shouldDisplaySubGroup2 && sortedSubGroup2List.length > 0 && (
          <>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: {
                  xs: '1rem', // Small screens (extra small breakpoint)
                  sm: '1.2rem', // Small screens
                  md: '2rem',   // Medium screens and above
                },
                fontWeight: '600',
                color: '#000',
                lineHeight: 1.2,
                letterSpacing: '0.5px',
                textTransform: 'uppercase', // Capitalizes the first letter of each word
                display: 'inline-block', // Ensures underline adjusts to text width
                textDecoration: 'underline', // Adds underline
                textDecorationColor: '#000', // Ensures the underline is black
                textDecorationThickness: '3px', // Adjusts the thickness of the underline
                textUnderlineOffset: '5px', // Adjusts the spacing between text and underline
              }}
            >
              Sub Categories
            </Typography>

            <Grid container spacing={3}>
              {sortedSubGroup2List
                .slice(0, visibleSubGroup2)
                .map((subcategory) => (
                  <Grid
                    key={subcategory.name}
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    xl={2}
                  >
                    <Box
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 1.5,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => handleProductClick(subcategory.name)}
                    >
                      <CourseWidgetSummaryData
                        title={subcategory.name}
                        image={subcategory.images}
                        imageChangeInterval={SUBCATEGORY_IMAGE_CHANGE_INTERVAL_MS}
                        randomImage
                        selected={isSubCategorySelected(subcategory.name)}
                      />
                    </Box>
                  </Grid>
                ))}
            </Grid>
            {sortedSubGroup2List.length > ITEMS_PER_LOAD && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end', // Align content to the right
                  justifyContent: 'center',
                  marginTop: '20px',
                  width: '300px',
                  marginX: 'auto', // Center the box horizontally
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: '10px',
                    fontWeight: 500,
                    color: '#333',
                    textAlign: 'center',
                  }}
                >
                  You&apos;ve viewed {visibleSubGroup2} of {sortedSubGroup2List.length} Product Categories
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={(visibleSubGroup2 / sortedSubGroup2List.length) * 100}
                  sx={{
                    height: 6,
                    width: '100%', // Match button and progress bar width
                    borderRadius: 3,
                    // backgroundColor: '#e0e0e0',
                    // '& .MuiLinearProgress-bar': {
                    //   backgroundColor: 'rgb(242, 25, 25)',
                    // },
                    marginBottom: '15px',
                  }}
                />

                <Button
                  onClick={() => {
                    if (visibleSubGroup2 < sortedSubGroup2List.length) {
                      setVisibleSubGroup2(sortedSubGroup2List.length);
                    } else {
                      setVisibleSubGroup2(ITEMS_PER_LOAD);

                      window.scrollTo({
                        top: 0, // Scroll to the top
                        behavior: 'smooth', // Add smooth scrolling effect
                      });
                    }
                  }}
                  sx={{
                    width: '100%', // Matches LinearProgress width
                    backgroundColor: '#000',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '10px 0', // Adjust padding for consistent height
                    textTransform: 'uppercase',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#000',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {visibleSubGroup2 >= sortedSubGroup2List.length
                    ? 'Show Less'
                    : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}

      </Stack>
      {(notFound || productsEmpty) && renderNotFound}
      <ProductList
        products={products}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}
