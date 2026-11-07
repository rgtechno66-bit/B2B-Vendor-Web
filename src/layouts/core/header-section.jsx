
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';
import { Button, IconButton, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from '@mui/material/Box';
import { useScrollOffSetTop } from 'src/hooks/use-scroll-offset-top';

import { useNavigate } from 'react-router';
import { useState } from 'react';
// ----------------------------------------------------------------------

const StyledElevation = styled('span')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  m: 'auto',
  height: 24,
  zIndex: -1,
  opacity: 0.48,
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export function HeaderSection({
  sx,
  slots,
  slotProps,
  disableOffset,
  disableElevation,
  layoutQuery = 'md',
  hideBottomBarOnMobile = false,
  ...other
}) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { offsetTop } = useScrollOffSetTop();

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/product`, { state: { searchTerm: searchTerm.trim() } });
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '919811068569';
    const message = 'Hello, I am interested in your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const searchBarSx = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: '25px',
    padding: '4px 16px',
    minHeight: 44,
    color: '#ec2932',
    width: '100%',
    maxWidth: 400,
    minWidth: 0,
    boxSizing: 'border-box',
  };

  const searchInput = (
    <>
      <InputBase
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        placeholder="Search here..."
        sx={{
          flex: 1,
          minWidth: 0,
          color: '#000',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: 1.5,
          '& .MuiInputBase-input': {
            padding: '6px 0',
          },
          '&::placeholder': {
            color: '#ec2932',
            opacity: 0.8,
          },
        }}
      />
      <IconButton
        type="button"
        onClick={handleSearchSubmit}
        sx={{
          backgroundColor: theme.palette.color.rgBackground,
          color: '#FFF',
          borderRadius: '50%',
          width: 36,
          height: 36,
          padding: '8px',
          marginLeft: '8px',
          flexShrink: 0,
          '&:hover': {
            backgroundColor: '#000',
          },
        }}
      >
        <SearchIcon />
      </IconButton>
    </>
  );

  return (
    <Box className="topFixed">
      {/* Top Section */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.color.rgBackground,
          padding: { xs: '6px 0', sm: '8px 0' },
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          color: '#FFF',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          {/* Row 1: Logo + actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: { xs: 0.75, sm: 1.5, md: 2 },
              width: '100%',
              flexWrap: 'nowrap',
            }}
          >
            {/* Left - Menu + Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                minWidth: 0,
                flexShrink: 0,
                mb: { xs: 0, md: '-30px' },
              }}
            >
              {slots?.leftArea}
            </Box>

            {/* Center - Search (from 768px up; hidden on smaller mobile) */}
            <Box
              sx={{
                ...searchBarSx,
                display: 'none',
                '@media (min-width: 768px)': {
                  display: 'flex',
                },
                flex: '0 1 400px',
              }}
            >
              {searchInput}
            </Box>

            {/* Right - Contact + Login */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1, md: 1.5 },
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.25, sm: 0.75 },
                  cursor: 'pointer',
                  padding: { xs: '4px', sm: '4px 8px' },
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                  },
                }}
                onClick={handleWhatsAppClick}
              >
                <WhatsAppIcon
                  sx={{
                    color: '#25D366',
                    fontSize: { xs: '22px', sm: '24px' },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#000',
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'block' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  WhatsApp
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: '#000',
                  fontWeight: 'bold',
                  display: { xs: 'none', md: 'block' },
                  whiteSpace: 'nowrap',
                }}
              >
                +91 9811068569
              </Typography>

              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: '#FFF',
                  color: '#000',
                  textTransform: 'none',
                  minWidth: { xs: 56, sm: 64 },
                  px: { xs: 1.25, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: 'none',
                  '&:hover': { color: '#000', backgroundColor: '#fff' },
                }}
                onClick={() => window.open('https://admin.intecomart.com', '_blank')}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {/* Bottom Navigation */}
      <Box
        sx={{
          backgroundColor: '#000',
          color: '#FFF',
          ...(hideBottomBarOnMobile && {
            display: { xs: 'none', [layoutQuery]: 'block' },
          }),
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              position: 'relative',
              height: { xs: 44, md: 48 },
              alignItems: 'center',
              // visible so Products/Resources hover menus are not clipped
              overflow: 'visible',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flex: '1 1 auto',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                gap: 1,
                height: 1,
                overflowX: { xs: 'auto', md: 'visible' },
                overflowY: 'visible',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {slots?.rightArea}
            </Box>
          </Box>
        </Container>
      </Box>

      {slots?.bottomArea}

      {!disableElevation && offsetTop && <StyledElevation />}
    </Box>
  );
}
