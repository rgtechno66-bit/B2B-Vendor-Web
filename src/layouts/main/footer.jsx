import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Switch,
  Link,
  Tooltip,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
  FaGithub,
  FaWhatsapp,
} from 'react-icons/fa';

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Logo } from 'src/components/logo';
import { getFooterInfo } from 'src/services/footerInfoApi';

const StyledFooter = styled(Box)(({ theme }) => ({
  background: theme.palette.color.rgBackground,
  padding: theme.spacing(6, 0),
  color: '#fff',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff4081 0%, #7c4dff 100%)',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    color: '#7c4dff',
  },
  '&:focus': {
    outline: '2px solid #7c4dff',
    outlineOffset: '2px',
  },
}));

// Helper function to get social media icon
const getSocialIcon = (platform) => {
  const iconMap = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    pinterest: FaPinterest,
    github: FaGithub,
    whatsapp: FaWhatsapp,
  };

  const platformKey = platform?.toLowerCase().replace(/\s+/g, '');
  return iconMap[platformKey] || FaFacebook;
};

export function Footer({ layoutQuery, sx }) {
  const theme = useTheme();
  const [footerInfo, setFooterInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterInfo = async () => {
      try {
        const data = await getFooterInfo();
        setFooterInfo(data);
      } catch (error) {
        console.error('Failed to load footer info:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFooterInfo();
  }, []);

  return (
    <StyledFooter>
      <Container maxWidth="2xl">
        <Grid container spacing={4} sx={{ px: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ mb: 1 }}>
              <Logo navbarDefault />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
              {footerInfo?.companyName || 'Rg techno Industrial Products Pvt Ltd.'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* Contact Info Header */}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#000', // Color for the "Contact Info" header
                fontSize: {
                  xs: '1.1rem', // Small devices
                  sm: '1.2rem', // Medium devices
                  md: '1.4rem', // Larger devices
                },
              }}
            >
              Contact Info
            </Typography>

            {/* Contact Info Content */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                // paddingTop: 2, // Add padding at the top to space out from header
              }}
            >
              {/* Address Section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap',
                }}
              >
                {/* Icon Section */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center', // Ensures vertical alignment
                    gap: 1, // Spacing between icon and text
                    flexWrap: 'nowrap', // Prevents icon or text from wrapping
                  }}
                >
                  {/* Icon Section */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      color: theme.palette.color.red,
                      flexShrink: 0, // Ensures icon does not shrink
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: '1.5rem' }} />
                  </Box>

                  {/* Text Section */}
                  <Box
                    sx={{
                      mt: 1,
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                      '& p': { margin: '4px 0' },
                      '& br': { display: 'block', content: '""', marginTop: '4px' },
                      '& strong': { fontWeight: 'bold' },
                      '& em': { fontStyle: 'italic' },
                      '& ul': { paddingLeft: '16px', margin: '4px 0' },
                      '& ol': { paddingLeft: '16px', margin: '4px 0' },
                      '& li': { margin: '2px 0' },
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        footerInfo?.companyAddress ||
                        'RG TECHNO INDUSTRIAL PRODUCTS PVT LTD<br/>F-471 SECTOR-63, NOIDA-201301<br/>Uttar Pradesh, INDIA',
                    }}
                  />
                </Box>
              </Box>

              {/* Phone Section */}
              {footerInfo?.mobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      color: theme.palette.color.red,
                    }}
                  >
                    <PhoneIcon />
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {footerInfo.mobile}
                  </Typography>
                </Box>
              )}

              {/* Email Section */}
              {footerInfo?.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      color: theme.palette.color.red,
                    }}
                  >
                    <EmailIcon />
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {footerInfo.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                // color: theme.palette.color.lightGrey, // Color for the "Contact Info" header
                color: '#000', // Color for the "Contact Info" header
                fontSize: {
                  xs: '1.1rem', // Small devices
                  sm: '1.2rem', // Medium devices
                  md: '1.4rem', // Larger devices
                },
              }}
            >
              About Us
            </Typography>
            <Box
              sx={{
                fontSize: {
                  xs: '0.8rem', // Small devices
                  sm: '0.9rem', // Medium devices
                  md: '1rem', // Larger devices
                  lg: '1.1rem', // Larger devices
                },
                lineHeight: {
                  xs: 1.4,
                  sm: 1.6,
                  md: 1.8,
                },
                wordBreak: 'break-word',
                '& p': { margin: '4px 0' },
                '& br': { display: 'block', content: '""', marginTop: '4px' },
                '& strong': { fontWeight: 'bold' },
                '& em': { fontStyle: 'italic' },
                '& ul': { paddingLeft: '16px', margin: '4px 0' },
                '& ol': { paddingLeft: '16px', margin: '4px 0' },
                '& li': { margin: '2px 0' },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  footerInfo?.aboutUs ||
                  'At Intecomart, we are proud to be a trusted leader in the industrial solutions sector, offering a robust platform for businesses to access a wide range of products across diverse categories and subcategories. Our multi-vendor marketplace fosters seamless transactions, competitive pricing, and superior product quality.',
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                ml: 2,
                fontWeight: 'bold',
                color: '#000', // Color for the "Follow Us" header
                fontSize: {
                  xs: '1.1rem', // Small devices
                  sm: '1.2rem', // Medium devices
                  md: '1.4rem', // Larger devices
                },
                textAlign: 'left', // Center the header
              }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              {footerInfo?.socialMediaLinks && footerInfo.socialMediaLinks.length > 0 ? (
                footerInfo.socialMediaLinks.map((social, index) => {
                  const IconComponent = getSocialIcon(social.platform);
                  return (
                    <Tooltip key={index} title={social.platform} arrow>
                      <SocialButton
                        aria-label={social.platform.toLowerCase()}
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconComponent />
                      </SocialButton>
                    </Tooltip>
                  );
                })
              ) : (
                <>
                  <Tooltip title="Facebook" arrow>
                    <SocialButton aria-label="facebook">
                      <FaFacebook />
                    </SocialButton>
                  </Tooltip>
                  <Tooltip title="Twitter" arrow>
                    <SocialButton aria-label="twitter">
                      <FaTwitter />
                    </SocialButton>
                  </Tooltip>
                  <Tooltip title="Instagram" arrow>
                    <SocialButton aria-label="instagram">
                      <FaInstagram />
                    </SocialButton>
                  </Tooltip>
                  <Tooltip title="LinkedIn" arrow>
                    <SocialButton aria-label="linkedin">
                      <FaLinkedin />
                    </SocialButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            {/* Disclaimer/Copyright - Starting position */}
            <Typography variant="h6" fontFamily="serif" color="#000">
              © {new Date().getFullYear()} {footerInfo?.disclaimer}
            </Typography>
            
            {/* Terms and Privacy Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Link
                component={RouterLink}
                href="/terms-and-condition"
                variant="body2"
                sx={{
                  color: '#000000',
                  textDecoration: 'none',
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.1rem',
                  },
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid #000000',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    textDecoration: 'none',
                    borderColor: '#7c4dff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.4)',
                  },
                }}
              >
                Terms and Conditions
              </Link>
              <Link
                component={RouterLink}
                href="/privacy-policy"
                variant="body2"
                sx={{
                  color: '#000000',
                  textDecoration: 'none',
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.1rem',
                  },
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid #000000',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    textDecoration: 'none',
                    borderColor: '#7c4dff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.4)',
                  },
                }}
              >
                Privacy Policy
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  );
}

// ----------------------------------------------------------------------

export function HomeFooter({ sx }) {
  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
        ...sx,
      }}
    >
      <Container>
        <Logo navbarDefault />
      </Container>
    </Box>
  );
}
