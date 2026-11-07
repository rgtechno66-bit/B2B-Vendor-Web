import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getContactMessage } from 'src/services/contactUsApi';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';

const ContactContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4, 0),
  width: '100%',
  overflowX: 'hidden',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0),
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 48,
  height: 48,
  flexShrink: 0,
  backgroundColor: theme.palette.primary.light,
  borderRadius: '50%',
  boxShadow: theme.shadows[4],
  [theme.breakpoints.up('sm')]: {
    width: 64,
    height: 64,
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[3],
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const SectionBody = styled(Box)(() => ({
  flex: 1,
  width: '100%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
}));

export function ContactFormData() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoData] = await Promise.all([getContactMessage()]);
        setContactInfo(infoData);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Failed to fetch contact data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container
        sx={{ py: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <ContactContainer>
      <Container maxWidth="lg" disableGutters={false} sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            mb: { xs: 3, md: 4 },
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            px: 1,
          }}
        >
          Get In Touch With Us
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2.5, md: 4 },
            width: '100%',
            alignItems: 'stretch',
          }}
        >
          {/* Left: Office Address */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%', display: 'flex' }}>
            <SectionCard>
              <SectionHeader>
                <IconWrapper>
                  <Iconify icon="eva:home-fill" width={28} height={28} />
                </IconWrapper>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    m: 0,
                    fontSize: { xs: '1.15rem', sm: '1.35rem' },
                  }}
                >
                  Office Address
                </Typography>
              </SectionHeader>

              <SectionBody>
                {contactInfo?.message ? (
                  <Box
                    sx={{
                      width: '100%',
                      minWidth: 0,
                      textAlign: 'left !important',
                      color: 'text.primary',
                      fontSize: { xs: '0.875rem', sm: '0.95rem' },
                      lineHeight: 1.75,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      '& *': {
                        textAlign: 'left !important',
                        margin: '0 !important',
                        padding: '0 !important',
                        boxSizing: 'border-box',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                      },
                      '& p, & div, & span, & h1, & h2, & h3, & h4, & h5, & h6': {
                        display: 'block',
                        width: '100%',
                        textAlign: 'left !important',
                      },
                      '& br + br': {
                        display: 'none',
                      },
                      '& strong, & b': {
                        fontWeight: 700,
                        color: 'text.primary',
                      },
                      '& a': {
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'inline',
                        width: 'auto',
                        '&:hover': { textDecoration: 'underline' },
                      },
                      '& ul, & ol': {
                        paddingLeft: '20px !important',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      },
                      '& li': {
                        display: 'list-item',
                        width: 'auto',
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: decodeURIComponent(contactInfo.message),
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ textAlign: 'left' }}>
                    No message found
                  </Typography>
                )}
              </SectionBody>
            </SectionCard>
          </Box>

          {/* Right: Send Us a Message */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%', display: 'flex' }}>
            <SectionCard>
              <SectionHeader>
                <IconWrapper>
                  <Iconify icon="eva:message-circle-outline" width={28} height={28} />
                </IconWrapper>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    m: 0,
                    fontSize: { xs: '1.15rem', sm: '1.35rem' },
                  }}
                >
                  Send Us a Message
                </Typography>
              </SectionHeader>

              <SectionBody>
                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 2.5 },
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 2, sm: 2.5 },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Your Name"
                      variant="outlined"
                      required
                      sx={{ flex: 1, minWidth: 0 }}
                    />
                    <TextField
                      fullWidth
                      label="Your Email"
                      variant="outlined"
                      required
                      sx={{ flex: 1, minWidth: 0 }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Your Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                  />

                  <Box sx={{ width: '100%', textAlign: 'left' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        mb: 0.75,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      }}
                    >
                      By clicking <strong>Submit Now</strong>, I agree to the{' '}
                      <Link
                        component={RouterLink}
                        to={paths.termsandcondition}
                        underline="hover"
                        sx={{ fontWeight: 700, color: 'primary.main' }}
                      >
                        Terms & Conditions
                      </Link>{' '}
                      for the uses of service.
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        mb: 2.5,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      }}
                    >
                      I am giving my consent to receive updates through SMS/Email.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        maxWidth: { sm: 220 },
                        px: 4,
                        py: 1.25,
                        borderRadius: 999,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#fff',
                        boxShadow: 'none',
                        background: 'linear-gradient(90deg, #1a237e 0%, #2962ff 100%)',
                        '&:hover': {
                          boxShadow: 'none',
                          background: 'linear-gradient(90deg, #0d1657 0%, #1e4fe0 100%)',
                        },
                      }}
                    >
                      Submit Now
                    </Button>
                  </Box>
                </Box>
              </SectionBody>
            </SectionCard>
          </Box>
        </Box>
      </Container>
    </ContactContainer>
  );
}
