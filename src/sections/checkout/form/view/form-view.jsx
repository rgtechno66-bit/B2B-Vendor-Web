import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper,
    Divider,
    Chip,
    Avatar,
    Alert,
    InputAdornment
} from '@mui/material';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useCheckoutContext } from '../../context';
import { addAddress } from 'src/redux/orderProductAndAddressReducer';
import { Iconify, FlagIcon } from 'src/components/iconify';
import { fetchStates } from 'src/services/checkoutApi';

export const NewAddressSchema = zod.object({
    state: zod.string().min(1, { message: 'State is required!' }),
    name: zod.string().min(1, { message: 'Name is required!' }),
    address: zod.string().min(1, { message: 'Address is required!' }),
    pincode: zod.string().min(1, { message: 'Zip code is required!' }),
    mobile: zod
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits!' })
    .max(15, { message: 'Phone number must be at most 15 digits!' }),
    country: zod.union([
        zod.string().min(1, { message: 'Country is required!' }),
        schemaHelper.objectOrNull({ message: { required_error: 'Country is required!' } }),
    ]),
    email: zod.string().email({ message: 'Invalid email!' }).or(zod.literal('')),
});

export function FormView() {
    const addressData = useSelector((state) => state.order.address);
    const checkout = useCheckoutContext();
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statesList, setStatesList] = useState([]);

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewAddressSchema),
        defaultValues: {
            name: '',
            email: '',
            state: '',
            address: '',
            pincode: '',
            country: 'India',
            primary: true,
            mobile: '',
        },
    });

    const { handleSubmit, formState: { isSubmitting }, reset } = methods;

    useEffect(() => {
        let mounted = true;
        fetchStates().then((list) => {
            if (mounted && Array.isArray(list)) setStatesList(list);
        });
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (addressData) {
            reset({ ...addressData, country: addressData.country || 'India' });
        }
    }, [addressData, reset]);

    const onSubmit = handleSubmit(async (data) => {
        if (isProcessing || isSubmitting) {
            return;
        }

        setIsProcessing(true);
        try {
            const userDetails = {
                name: data.name,
                address: data.address,
                country: data.country,
                state: data.state,
                pincode: data.pincode,
                mobile: data.mobile,
                email: data.email,
            };

            dispatch(addAddress(userDetails));
            await checkout.onCreateBilling(data);
            checkout.onGotoStep(2);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsProcessing(false);
        }
    });

    return (
        <Box sx={{ 
            backgroundColor: '#f8f9fa', 
            minHeight: '100vh',
            py: 3
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        Enter your delivery address details
                    </Typography>
                    <Button
                        size="small"
                        onClick={checkout.onBackStep}
                        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                        sx={{ 
                            color: '#666',
                            '&:hover': { backgroundColor: '#f0f0f0' }
                        }}
                    >
                        Back to Cart
                    </Button>
                </Box>

                <Paper sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                }}>
                    <Form methods={methods} onSubmit={onSubmit}>
                        {/* Form Header */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 4,
                            pb: 2,
                            borderBottom: '2px solid #f0f0f0'
                        }}>
                            <Avatar sx={{ 
                                bgcolor: '#4caf50',
                                mr: 2,
                                width: 48,
                                height: 48
                            }}>
                                <Iconify icon="mdi:account-plus" />
                            </Avatar>
                            <Box>
                             
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    Fill in your delivery information
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Stack spacing={3}>
                                <Field.Text 
                                    name="name" 
                                    label="Full Name" 
                                    placeholder="Enter your full name"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#ff6b35',
                                            },
                                        }
                                    }}
                                />
                                
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(2, 1fr)',
                                    }}
                                >
                                    <Field.Text 
                                        name="mobile" 
                                        label="Phone Number" 
                                        placeholder="Enter your mobile number"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                                    <FlagIcon code="IN" sx={{ width: 22, height: 18 }} />
                                                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                                                        +91
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#ff6b35',
                                                },
                                            }
                                        }}
                                    />
                                    <Field.Text 
                                        name="email" 
                                        label="Email Address" 
                                        placeholder="Enter your email (optional)"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#ff6b35',
                                                },
                                            }
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ mb: 4 }}>
                            <Stack spacing={3}>
                                <TextField
                                    name="address"
                                    label="Complete Address"
                                    placeholder="Enter your complete address"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    {...methods.register('address')}
                                    error={!!methods.formState.errors.address}
                                    helperText={methods.formState.errors.address?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#ff6b35',
                                            },
                                        }
                                    }}
                                />

                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(3, 1fr)',
                                    }}
                                >
                                    <Field.Select
                                        native
                                        name="state"
                                        label="State"
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#ff6b35',
                                                },
                                            }
                                        }}
                                    >
                                        <option value="">Select state</option>
                                        {statesList.map((stateName) => (
                                            <option key={stateName} value={stateName}>
                                                {stateName}
                                            </option>
                                        ))}
                                    </Field.Select>
                                    <Field.Text 
                                        name="pincode" 
                                        label="PIN Code" 
                                        placeholder="Enter PIN code"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#ff6b35',
                                                },
                                            }
                                        }}
                                    />
                                    <Field.CountrySelect 
                                        name="country" 
                                        label="Country" 
                                        placeholder="India"
                                        disabled
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#ff6b35',
                                                },
                                            }
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        {/* Info Alert */}
                        <Alert 
                            severity="info" 
                            sx={{ 
                                mb: 3,
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                    color: '#ff6b35'
                                }
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Delivery Information:</strong> We&apos;ll use this address for all your future orders unless you change it.
                            </Typography>
                        </Alert>

                        {/* Submit Button */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 0 },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'stretch', sm: 'center' },
                            pt: 2,
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            <Button
                                variant="outlined"
                                onClick={checkout.onBackStep}
                                sx={{ 
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    borderColor: '#ccc',
                                    color: '#666',
                                    order: { xs: 2, sm: 1 },
                                    '&:hover': {
                                        borderColor: '#999',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            
                            <LoadingButton 
                                type="submit" 
                                variant="contained" 
                                loading={isSubmitting || isProcessing}
                                disabled={isSubmitting || isProcessing}
                                onClick={(e) => {
                                    if (isSubmitting || isProcessing) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                                sx={{
                                    backgroundColor: 'var(--primary-color-3)',
                                    color: '#fff',
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    minWidth: '140px',
                                    order: { xs: 1, sm: 2 },
                                
                                }}
                            >
                                <Iconify icon="mdi:truck-delivery" sx={{ mr: 1, fontSize: '1.1rem' }} />
                                Save Address
                            </LoadingButton>
                        </Box>
                    </Form>
                </Paper>
            </Container>
        </Box>
    );
}
