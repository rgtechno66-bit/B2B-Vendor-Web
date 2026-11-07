import { forwardRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';
import { useDispatch } from 'react-redux';
import { LogoList } from 'src/services/bannerApi';
import { CONFIG } from 'src/config-global';
import { toAbsoluteUploadUrl } from 'src/utils/product-image';

/** Default logo from public/logo/logo.png when API logo missing/broken */
export const DEFAULT_LOGO = `${CONFIG.site.basePath || ''}/logo/logo.png`;

// ----------------------------------------------------------------------

export const Logo = forwardRef(
  (
    {
      width: widthProp,
      height: heightProp,
      disableLink = false,
      className,
      href = '/',
      navbarDefault = false,
      sx,
      ...other
    },
    ref
  ) => {
    // Navbar uses the original brand size (150x60); default elsewhere is 40x40
    const width = widthProp ?? (navbarDefault ? 150 : 40);
    const height = heightProp ?? (navbarDefault ? 60 : 40);

    const [logos, setLogos] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await dispatch(LogoList());
          if (res?.logoImage) {
            setLogos(res);
          }
        } catch {
          // keep default logo when API fails
        }
      };
      fetchData();
    }, [dispatch]);

    const rawLogo = logos?.logoImage?.trim?.() || logos?.logoImage;
    const apiLogo = typeof rawLogo === 'string' ? toAbsoluteUploadUrl(rawLogo) : rawLogo;
    const logoSrc = apiLogo || DEFAULT_LOGO;

    const handleLogoError = (event) => {
      if (event.currentTarget.dataset.fallbackApplied === '1') return;
      event.currentTarget.dataset.fallbackApplied = '1';
      event.currentTarget.src = DEFAULT_LOGO;
    };

    const logo = (
      <Box
        component="img"
        alt="logo"
        src={logoSrc}
        onError={handleLogoError}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    );

    const ssrFallback = (
      <Box
        component="img"
        alt="logo"
        src={DEFAULT_LOGO}
        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    );

    return (
      <NoSsr
        fallback={
          <Box
            ref={ref}
            component={RouterLink}
            href={href}
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{
              flexShrink: 0,
              display: 'inline-flex',
              verticalAlign: 'middle',
              ...sx,
            }}
          >
            {ssrFallback}
          </Box>
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
