import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Container,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions as DialogActionsMUI,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Badge,
} from '@mui/material';
import { addAddress, resetProductAndAddress } from 'src/redux/orderProductAndAddressReducer';
import { useCheckoutContext } from '../../context';
import { Iconify } from 'src/components/iconify';
import {
  getProductDisplayImage,
  handleProductImageError,
} from 'src/utils/product-image';
import { createCheckout } from 'src/services/checkoutApi';

export function OrderAndAddressView() {
  const checkout = useCheckoutContext();
  const dispatch = useDispatch();

  const address = useSelector((state) => state.order.address);
  const productDetails = useSelector((state) => state.order.productDetails);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Check if address is available on component mount
  // React.useEffect(() => {
  //   if (!address || Object.keys(address).length === 0) {
  //     // If no address is available, go back to previous step
  //     checkout.onBackStep();
  //   }
  // }, [address, checkout]);

  // Calculate total amount
  const totalAmount =
    checkout.items?.reduce((total, product) => {
      const itemTotal = product.sellingPrice * product.stdPkg * product.noOfPkg;
      return total + itemTotal;
    }, 0) || 0;

  // Check if total amount is valid and items exist
  const hasItems = checkout.items && checkout.items.length > 0;
  const isValidTotalAmount = totalAmount && totalAmount > 0 && !Number.isNaN(totalAmount) && hasItems;

  const handleConfirmOrder = () => {
    // Check if total amount is valid
    if (!hasItems) {
      alert('Cannot place order: No items in your cart');
      return;
    }
    if (!isValidTotalAmount) {
      alert('Cannot place order: Total amount must be greater than 0');
      return;
    }
    // Additional check before opening dialog
    if (!address || Object.keys(address).length === 0) {
      checkout.onBackStep();
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmYes = async () => {
    // Validate total amount before proceeding
    if (!hasItems) {
      alert('Cannot place order: No items in your cart');
      setOpenDialog(false);
      return;
    }
    if (!isValidTotalAmount) {
      alert('Cannot place order: Total amount must be greater than 0');
      setOpenDialog(false);
      return;
    }

    setIsLoading(true);
    try {
     
      const checkoutPayload = {
        address: {
          name: address.name,
          email: address.email,
          mobile: address.mobile,
          address: address.address,
          state: address.state,
          country: address.country,
          pincode: address.pincode,
        },
        products: checkout.items.map((item) => ({
          id: item.id,
          itemName: item.itemName,
          noOfPkg: item.noOfPkg || 1,
          quantity: item.stdPkg || 1,
          sellingPrice: item.sellingPrice,
          stdPkg: item.stdPkg || 1,
          subtotal: item.sellingPrice * (item.stdPkg || 1) * (item.noOfPkg || 1),
          coverUrl: item.coverUrl,
          productImages: item.productImages,
        })),
        subtotal: totalAmount,
        total: totalAmount,
        discount: 0,
        notes: 'Order placed from web application',
      };

      // Call backend API
      const response = await createCheckout(checkoutPayload);
      if (response.success) {
        if (response.data.emailPdf) {
          window.open(response.data.emailPdf, '_blank'); // Opens the PDF in a new tab
        }

        try {
          await checkout.onCreateBilling(address);
          checkout.onGotoStep(3);
          dispatch(resetProductAndAddress());
        } catch (error) {
          console.error('Order confirmation failed', error);
        } finally {
          setOpenDialog(false);
        }
      }
    } catch (error) {
      console.error('Order placement failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmNo = () => {
    setOpenDialog(false);
  };

  // If no address is available, don't render the component
  if (!address || Object.keys(address).length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Progress */}
        <Box sx={{ mb: 4 }}>
          <Button
            size="small"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{
              mb: 2,
              color: '#666',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            Back to Cart
          </Button>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 1,
            }}
          >
            Review Your Order
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Please review your items and delivery address before placing your order
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Products */}
          <Grid item xs={12} lg={8}>
            {/* Products Section */}
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid #f0f0f0',
                }}
              >
                <Iconify icon="mdi:package-variant" sx={{ mr: 1, color: '#ff6b35' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Items in Your Order ({checkout.items?.length || 0})
                </Typography>
              </Box>

              <Stack spacing={2}>
                {checkout.items && checkout.items.length > 0 ? (
                  checkout.items.map((product, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: '#fafafa',
                        border: '1px solid #e8e8e8',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          mr: 2,
                          borderRadius: 1,
                          overflow: 'hidden',
                          backgroundColor: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={getProductDisplayImage(product.productImages)}
                          alt={product.itemName}
                          onError={handleProductImageError}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 0.5,
                          }}
                        >
                          {product.itemName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            mb: 1,
                          }}
                        >
                          Quantity: {product.stdPkg * product.noOfPkg} units
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`₹${product.sellingPrice}/unit`}
                            size="small"
                            sx={{
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#1a1a1a',
                          }}
                        >
                          ₹{product.sellingPrice * product.stdPkg * product.noOfPkg}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      color: '#666',
                    }}
                  >
                    <Iconify
                      icon="mdi:package-variant-closed"
                      sx={{ fontSize: 48, mb: 2, color: '#ccc' }}
                    />
                    <Typography variant="h6">No items in your order</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Address Section */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid #f0f0f0',
                }}
              >
                <Iconify icon="mdi:map-marker" sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Delivery Address
                </Typography>
              </Box>

              {address ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e8e8e8',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#4caf50',
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Iconify icon="mdi:account" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {address.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {address.mobile}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {address.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {address.address}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {address.state}, {address.country} - {address.pincode}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    color: '#666',
                  }}
                >
                  <Iconify icon="mdi:map-marker-off" sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
                  <Typography variant="h6">No delivery address selected</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} lg={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                position: 'sticky',
                top: 20,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: '#1a1a1a',
                }}
              >
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Items ({checkout.items?.length || 0})
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    ₹{totalAmount}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Delivery Charges
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                    FREE
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: '#1a1a1a',
                    }}
                  >
                    ₹{totalAmount}
                  </Typography>
                </Box>
              </Box>

              <LoadingButton
                fullWidth
                variant="contained"
                onClick={handleConfirmOrder}
                disabled={!isValidTotalAmount}
                sx={{
                  backgroundColor: 'var(--primary-color-3)',
                  color: '#fff',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-color-3)',
                    boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#ccc',
                    color: '#666',
                    boxShadow: 'none',
                    cursor: 'not-allowed',
                  },
                }}
              >
                <Iconify icon="mdi:check-circle" sx={{ mr: 1 }} />
                Place Order
              </LoadingButton>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 2,
                  color: '#666',
                }}
              >
                By placing your order, you agree to our Terms & Conditions
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleConfirmNo}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            borderBottom: '1px solid #e0e0e0',
            pb: 2,
          }}
        >
          Confirm Your Order
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ color: '#666' }}>
            Are you sure you want to place this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActionsMUI sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleConfirmNo}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleConfirmYes}
            loading={isLoading}
            loadingIndicatorColor="#000000"
            variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color-3)',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#e55a2b',
              },
            }}
          >
            Confirm Order
          </LoadingButton>
        </DialogActionsMUI>
      </Dialog>
    </Box>
  );
}
