import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import { CheckoutCartProduct } from './checkout-cart-product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'std_pkg', label: 'Standard Packaging', align: 'center' },
  { id: 'no_pkg', label: 'No Of Package' },
  { id: 'quantity', label: 'Quantity', align: 'center' },
  { id: 'totalAmount', label: 'Total Price', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  return (
    <Scrollbar>
      <Table sx={{ minWidth: 720 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />

        <TableBody>
          {products.map((row) => (
            <CheckoutCartProduct
              key={row.id}
              row={row}
              onDelete={() => onDelete(row.id)}
              onDecrease={() => onDecreaseQuantity(row.id)}
              onIncrease={() => onIncreaseQuantity(row.id)}
            />
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );
}
