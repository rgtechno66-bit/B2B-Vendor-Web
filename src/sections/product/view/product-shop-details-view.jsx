import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Divider,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fCurrency, formatDateIndian } from 'src/utils/format-number';

import { CartIcon } from '../components/cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { Iconify } from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';

export function ProductShopDetailsView({ product }) {
  const checkout = useCheckoutContext();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/product');
  };

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <CartIcon totalItems={checkout.items.length} />

      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: paths?.product?.root },
          { name: product?.name },
        ]}
        sx={{ mb: 5 }}
      />
      <Button
        size="medium"
        color="inherit"
        onClick={handleBack}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
      >
        Back
      </Button>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={6}>
          <ProductDetailsCarousel images={product?.productImages} />
          {product && (
            <ProductDetailsSummary
              product={product}
              items={checkout.items}
              onAddCart={checkout.onAddToCart}
              onGotoStep={checkout.onGotoStep}
              disableActions={!product?.available}
            />
          )}
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <Typography variant="h5" gutterBottom mt={2}>
            {product?.itemName}
          </Typography>
          <Typography variant="h6" color="primary.main">
            {fCurrency(product?.sellingPrice)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            {product?.description}
          </Typography>

          {/* Classification Table */}
          <Box mt={5}>
            <Typography variant="subtitle1" gutterBottom>
              Classification
            </Typography>
            <Divider sx={{ my: 2 }} />
            <TableContainer component={Paper} elevation={0}>
              <Table size="small" aria-label="classification table">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>SubGroup1</TableCell>
                    <TableCell>{product?.subGroup1 || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>SubGroup2</TableCell>
                    <TableCell>{product?.subGroup2 || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Standard Package(Unit)</TableCell>
                    <TableCell>{product?.stdPkg || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Standard Weight(g)</TableCell>
                    <TableCell>{product?.stdWeight || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Responsive Grid System - Admin Panel Style */}
      <Grid container spacing={3}>
        {/* Box 1: Dimensional Files */}
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">
              {' '}
              <strong>Dimensional Files</strong>
            </Typography>
            <Divider sx={{ my: 2 }} />
            {product?.dimensionalFiles?.length > 0 ? (
              <Stack direction="column" spacing={0.5} sx={{ ml: 2, mt: 1 }}>
                {product.dimensionalFiles.map((file, index) => {
                  const isPdf = file.endsWith('.pdf');
                  return (
                    <Stack direction="row" spacing={1} alignItems="center" key={index}>
                      {isPdf ? (
                        <img
                          src="/pdf-logo/pdf.png"
                          alt="pdf"
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                      ) : (
                        <img
                          src={file}
                          alt={`Dimensional File ${index + 1}`}
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                      )}
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: '#1976d2' }}
                      >
                        Download
                      </a>
                    </Stack>
                  );
                })}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                No dimensional files available
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Box 3: Tax & Unit Details */}
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Tax & Unit Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
            
             
              <Typography variant="body2">
                <strong>GST Rate:</strong> <span>{product?.gstRate}</span>
              </Typography>
              <Typography variant="body2">
                <strong>Base Unit:</strong> <span>{product?.baseUnit || 'No Data Available'}</span>
              </Typography>
              <Typography variant="body2">
                <strong>Alternate Unit:</strong>{' '}
                <span>{product?.alternateUnit || 'No Data Available'}</span>
              </Typography>
            </Stack>
          </Box>
        </Grid>

        {/* Box 4: Conversion */}
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Conversion
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Taxability:</strong>{' '}
                <span>{product?.taxability || 'No Data Available'}</span>
              </Typography>
            
              <Typography variant="body2">
                <strong>Denominator:</strong>{' '}
                <span>{product?.denominator || 'No Data Available'}</span>
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
    </Container>
  );
}
