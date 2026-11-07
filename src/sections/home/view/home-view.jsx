import Stack from '@mui/material/Stack';
import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeCarousel } from '../home-crousel';
import { HomeProductGroup } from '../home-productGroup';
import { HomeLetestProduct } from '../home-letestProduct';
import { ProductTopList } from '../home-top-product';

export function HomeView() {
  // Hook to track page scroll progress for scroll indicator
  const pageProgress = useScrollProgress();

  return (
    <div>

      {/* Scroll progress bar for visual feedback on page scroll */}
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed', top: 0, zIndex: 9999 }}
      />

      {/* Button to quickly scroll back to top */}
      <BackToTop />

      {/* Main Hero Section */}

      {/* Content stack for homepage sections */}
      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }} className='HeroHome'>
        <div className="small-circle circle-1" />
        <div className="small-circle circle-2" />
        {/* Pricing section for e-commerce plans, deals, or products */}
        
        {/* Home Banner */}
        <HomeCarousel />

        {/* Home Category */}
        <HomeProductGroup />

        {/* Top Hot Products */}
        <ProductTopList />

        {/* Home Letest Product */}
        <HomeLetestProduct />
      </Stack>
    </div>
  );
}
