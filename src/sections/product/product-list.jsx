import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ProductItem } from './product-item';
import { ProductItemSkeleton } from './product-skeleton';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const DEFAULT_GRID_COLUMNS = {
  xs: 'repeat(2, 1fr)',
  sm: 'repeat(3, 1fr)',
  md: 'repeat(4, 1fr)',
  lg: 'repeat(5, 1fr)',
  xl: 'repeat(6, 1fr)',
  '2xl': 'repeat(7, 1fr)',
};

export function ProductList({
  products,
  loading,
  page,
  totalPages = 1,
  onPageChange,
  gridColumns = DEFAULT_GRID_COLUMNS,
  ...other
}) {
  const hasProducts = Array.isArray(products) && products.length > 0;
  // Keep existing cards while searching — only show skeleton on first empty load
  const showSkeleton = loading && !hasProducts;

  const renderLoading = (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = products.map((product) => (
    <ProductItem key={product.id} product={product} />
  ));

  const handleChangePage = (event, newPage) => {
    onPageChange?.(newPage);
  };

  return (
    <div>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontSize: {
            xs: '1rem',
            sm: '1.2rem',
            md: '2rem',
          },
          fontWeight: '600',
          color: '#000',
          lineHeight: 1.2,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          display: 'inline-block',
          textDecoration: 'underline',
          textDecorationColor: '#000',
          textDecorationThickness: '3px',
          textUnderlineOffset: '5px',
        }}
      >
        Products
      </Typography>

      <Box
        mt={3}
        gap={2}
        display="grid"
        alignItems="start"
        gridTemplateColumns={gridColumns}
        sx={{
          opacity: loading && hasProducts ? 0.55 : 1,
          transition: 'opacity 0.2s ease',
          pointerEvents: loading && hasProducts ? 'none' : 'auto',
        }}
        {...other}
      >
        {showSkeleton ? renderLoading : renderList}
      </Box>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </div>
  );
}
