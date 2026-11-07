import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { OrderCompleteIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CheckoutOrderComplete({ open, onReset, onDownloadPDF }) {
  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          width: { md: `calc(100% - 48px)` },
          height: { md: `calc(100% - 48px)` },
        },
      }}
    >
      <Box
        gap={5}
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{
          py: 5,
          m: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Thank you for your purchase!</Typography>

        <OrderCompleteIllustration />

        
        <Typography sx={{ mt: 2 }}>
          Your order has been successfully placed and received by our team!
        </Typography>
        <Typography sx={{ mt: 1 }}>
          We will keep you updated and notify you once it ships. Get ready for an amazing experience!
        </Typography>

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <Button
            size="large"
            color="inherit"
            variant="outlined"
            onClick={onReset}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Continue shopping
          </Button>

          {/*
            <Button
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:cloud-download-fill" />}
              onClick={onDownloadPDF}
            >
              Download as PDF
            </Button>
          */}
        </Box>
      </Box>
    </Dialog>
  );
}
