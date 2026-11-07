import React, { useEffect, useState } from 'react';
import { fetchLatestProducts } from 'src/services/productApi';
import {
  Container,
  Grid,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  Card,
  Divider,
} from '@mui/material';
import { AiOutlineWarning } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import { fCurrency } from 'src/utils/format-number';
import {
  getProductDisplayImage,
  handleProductImageError,
} from 'src/utils/product-image';

const HOME_LATEST_LIMIT = 12;

export function HomeLetestProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const getProducts = async () => {
      setLoading(true);
      try {
        const result = await fetchLatestProducts(1, HOME_LATEST_LIMIT, controller.signal);
        if (!controller.signal.aborted) {
          setProducts(result?.data || []);
        }
      } catch (error) {
        if (controller.signal.aborted || error?.name === 'CanceledError') return;
        console.error('Error fetching latest products:', error);
        setProducts([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Container className="containerCss" style={{ textAlign: 'center', marginTop: '50px' }}>
        <Box
          sx={{
            backgroundColor: '#807f7fc2',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >
          <AiOutlineWarning style={{ fontSize: '48px', color: '#f44336' }} />
          <Typography variant="h4" color="#fff" style={{ fontWeight: 'bold', marginTop: '15px' }}>
            No products found.
          </Typography>
          <Typography variant="body1" color="#fff" style={{ marginTop: '10px' }}>
            Please try again later.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container className="containerCss mb-5">
      <Box mb={3} className="Latest_PRG">
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
            borderBottom: '3px solid rgb(14, 13, 13)',
            display: 'inline-block',
            paddingBottom: '5px',
          }}
        >
          Latest Products
        </Typography>

        <Button
          variant="text"
          onClick={() => navigate('/product?limit=20&sortBy=newest')}
          className="text-primary ViewAll"
        >
          View All <MdOutlineKeyboardDoubleArrowRight />
        </Button>
      </Box>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={6} sm={6} md={4} lg={2} key={product.id}>
            <Card
              sx={{
                width: 'auto',
                height: 'auto',
                border: '2px solid #FF6600',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  border: '5px solid #FF6600',
                },
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <Box
                sx={{
                  height: 180,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={getProductDisplayImage(product.productImages)}
                  alt={product.itemName || 'Product'}
                  onError={handleProductImageError}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Divider />
              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="body1"
                  className="productTitle"
                  sx={{
                    textAlign: 'left',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.itemName || 'ItemName Not Available'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '15px',
                    textAlign: 'left',
                    marginBottom: '2px',
                  }}
                >
                  {product.sellingPrice ? fCurrency(product.sellingPrice) : 'Price Not Available'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    textAlign: 'left',
                    marginBottom: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.description?.length > 50
                    ? `${product.description.slice(0, 50)}...`
                    : product.description || 'Description Not Available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const LoadingScreen = () => (
  <div className="loadingScreen" style={{ textAlign: 'center', marginTop: '50px' }}>
    <CircularProgress />
    <p>Loading products...</p>
  </div>
);
