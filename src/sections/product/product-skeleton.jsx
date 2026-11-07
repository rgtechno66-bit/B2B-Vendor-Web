import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

export function ProductItemSkeleton({ sx, ...other }) {
  return (
    <Card
      sx={{
        width: '100%',
        border: '2px solid #FF6600',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: { xs: 110, sm: 125, md: 135 },
        }}
      />
      <Divider />
      <CardContent sx={{ p: { xs: 1, sm: 1.25 }, '&:last-child': { pb: { xs: 1, sm: 1.25 } } }}>
        <Skeleton sx={{ height: 14, width: '90%', mb: 0.5 }} />
        <Skeleton sx={{ height: 12, width: '55%', mb: 0.5 }} />
        <Skeleton sx={{ height: 16, width: '35%', mb: 0.5 }} />
        <Skeleton sx={{ height: 12, width: '75%' }} />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function ProductDetailsSkeleton({ ...other }) {
  return (
    <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={4} {...other}>
      <Skeleton variant="rectangular" sx={{ width: '100%', pt: '75%' }} />
      <Box>
        <Skeleton sx={{ height: 16, width: 48, mb: 2 }} />
        <Skeleton sx={{ height: 28, width: '80%', mb: 2 }} />
        <Skeleton sx={{ height: 16, width: '50%', mb: 2 }} />
        <Skeleton sx={{ height: 16, width: '70%', mb: 2 }} />
        <Skeleton sx={{ height: 120 }} />
      </Box>
    </Box>
  );
}
