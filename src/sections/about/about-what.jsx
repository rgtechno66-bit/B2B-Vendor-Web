import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { DEFAULT_ABOUT_IMAGE } from 'src/constfile/dummyImage';
import { varAlpha, stylesMode } from 'src/theme/styles';
import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';
import { fetchAboutUs } from 'src/services/aboutUsApi';

export function AboutWhat() {
  const theme = useTheme();
  const [aboutUsData, setAboutUsData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadAboutUsData = async () => {
      try {
        const data = await fetchAboutUs();
        setAboutUsData(data);
      } catch (error) {
        console.error('Failed to load about us data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAboutUsData();
  }, []);

  return (
    <Container
      component={MotionViewport}
      sx={{ py: { xs: 10, md: 15 }, textAlign: { xs: 'center', md: 'unset' } }}
    >
      <Grid container columnSpacing={{ md: 3 }} alignItems="center">
        {/* Left Section: Images */}
        <Grid
          container
          xs={12}
          md={6}
          lg={7}
          alignItems="center"
          sx={{
            pr: { md: 7 },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office small"
                src={aboutUsData?.imageSmall || DEFAULT_ABOUT_IMAGE}
                ratio="1/1"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                  },
                }}
              />
            </m.div>
          </Grid>

          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office large"
                src={aboutUsData?.imageLarge || DEFAULT_ABOUT_IMAGE}
                ratio="3/4"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                  },
                }}
              />
            </m.div>
          </Grid>
        </Grid>

        {/* Right Section: About Us Text */}
        <Grid xs={12} md={6} lg={5}>
          <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              About Us
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            {aboutUsData?.aboutUs ? (
              <>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: aboutUsData.aboutUs }} />
              </>
            ) : (
              <>
                <Typography
                  sx={{ color: 'text.secondary', [stylesMode.dark]: { color: 'common.white' } }}
                >
                  At *Intecomart*, we are proud to be a trusted leader in the industrial solutions sector, offering a robust platform for businesses to access a wide range of products across diverse categories and subcategories. Our multi-vendor marketplace fosters seamless transactions, competitive pricing, and superior product quality.
                </Typography>
                <Typography
                  sx={{ color: 'text.secondary', my: 2, [stylesMode.dark]: { color: 'common.white' } }}
                >
                  With a focus on efficiency and innovation, Intecomart is transforming how businesses and vendors collaborate, offering an intuitive platform where vendors showcase their products and customers place orders effortlessly.
                </Typography>
              </>
            )}
          </m.div>
        </Grid>
      </Grid>

      {/* Additional Content */}
      {(aboutUsData?.mission || aboutUsData?.vision || aboutUsData?.whatSetsUsApart || aboutUsData?.whyChooseUs) && (
        <Grid container spacing={3} sx={{ mt: 8 }}>
          {/* First Row */}
          {aboutUsData?.mission && (
            <Grid xs={12} md={6}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Our Mission
                </Typography>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: aboutUsData.mission }} />
              </Box>
            </Grid>
          )}
          
          {aboutUsData?.vision && (
            <Grid xs={12} md={6}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Our Vision
                </Typography>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: aboutUsData.vision }} />
              </Box>
            </Grid>
          )}

          {/* Second Row */}
          {aboutUsData?.whatSetsUsApart && (
            <Grid xs={12} md={6}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  What Sets Us Apart
                </Typography>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: aboutUsData.whatSetsUsApart }} />
              </Box>
            </Grid>
          )}
          
          {aboutUsData?.whyChooseUs && (
            <Grid xs={12} md={6}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Why Choose Us?
                </Typography>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: aboutUsData.whyChooseUs }} />
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
