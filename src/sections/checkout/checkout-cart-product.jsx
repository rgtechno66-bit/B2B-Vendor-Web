import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { IncrementerButton } from '../product/components/incrementer-button';
import {
  getProductDisplayImage,
  handleProductImageError,
} from 'src/utils/product-image';

// ----------------------------------------------------------------------

export function CheckoutCartProduct({ row, onDelete, onDecrease, onIncrease }) {

  const quantity = row.noOfPkg * row.stdPkg

  return (
    <TableRow>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar
            variant="rounded"
            alt={row.name}
            src={getProductDisplayImage(row.productImages)}
            imgProps={{ onError: handleProductImageError }}
            sx={{ width: 64, height: 64 }}
          />

          <Stack spacing={0.5}>
            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
              {row.itemName}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'body2', color: 'text.secondary' }}
            >
              {/*
              size: <Label sx={{ ml: 0.5 }}> {row.size} </Label>
              <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                <ColorPreview colors={row.colors} />
                */}
            </Stack>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>{fCurrency(row.sellingPrice)}</TableCell>

      <TableCell align="center">{row.stdPkg}</TableCell>
      <TableCell align="center">
        <Box sx={{ width: 88, textAlign: 'right' }}>
          <IncrementerButton
            noOfPkg={row.noOfPkg}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={row.noOfPkg <= 1}
          // disabledIncrease={row.quantity >= row.available}
          />

          {/*
        <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
          available: {row.available}
        </Typography>
      */}
        </Box>
      </TableCell>


      <TableCell align="center">
        {quantity}
      </TableCell>

      <TableCell align="right">{fCurrency(row.sellingPrice *  quantity)}</TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
