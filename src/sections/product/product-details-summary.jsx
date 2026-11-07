import { useEffect, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Form } from 'src/components/hook-form';
import { useDispatch } from 'react-redux';
import { setProductDetails } from 'src/redux/orderProductAndAddressReducer';

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    id,
    itemName,
    stdPkg,
    sellingPrice,
    coverUrl,
    productImages,
  } = product || {};

  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to manage button disable status
  // Check if product is already in cart
  const isProductInCart = items.some(item => item.id === id);

  const defaultValues = {
    id: id || '',
    itemName: itemName || '',
    coverUrl: coverUrl || '',
    productImages: productImages || [],
    noOfPkg: 1,
    stdPkg: stdPkg || '',
    sellingPrice: sellingPrice || 0,
    quantity: 1,
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    if (data) {
      dispatch(setProductDetails({ productDetails: data, quantity: data.quantity }));
      onGotoStep?.(1); // Call to update the step in the context if necessary
      router.push({
        pathname: paths.product.checkout,
        query: { step: 1 }, // Add step 1 to the query parameters
      });
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      setIsButtonDisabled(true); // Disable the button immediatel
      onAddCart?.({
        ...values,
        quantity: (values.stdPkg || 0) * (values.noOfPkg || 1),
        subtotal: (values.sellingPrice || 0) * (values.quantity || 1),
      });
    } catch (error) {
      setIsButtonDisabled(false); // Re-enable the button in case of error
      console.error(error);
    }
  }, [onAddCart, values]);


  const renderActions = (
    <Stack direction="row" spacing={2} mt={2}>
      <Button
        fullWidth
        disabled={isButtonDisabled || isProductInCart} // Disable if product is already in cart
  
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {isProductInCart ? 'Already in Cart' : 'Add to cart'}
      </Button>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        // disabled={disableActions}
        onClick={handleAddCart}
      >
        Buy now
      </Button>
    </Stack>
  );

  


  return (
    <Form methods={methods} onSubmit={onSubmit}>
  
        {renderActions}
    </Form>
  );
}
