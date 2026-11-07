import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';

import { createTheme } from './create-theme';
import { RTL } from './with-settings/right-to-left';
import { schemeConfig } from './color-scheme-script';
import { deepmerge } from '@mui/utils'; // Utility for merging themes
import themeVariables from './custom-font-color';

// ----------------------------------------------------------------------

export function ThemeProvider({ children }) {
  const { currentLang } = useTranslate();

  const settings = useSettingsContext();

  const theme = createTheme(currentLang?.systemValue, settings);

  // Custom theme with additional colors or configurations
  const themeCustom = {
    palette: {
      color: {
        red: themeVariables.colors.fullRed,
        orangishRed: themeVariables.colors.orangishRed,
        mediumRed: themeVariables.colors.mediumRed,
        linerBackground: themeVariables.colors.footerBg,
        lightGrey: themeVariables.colors.grey,
        categoryBackground: themeVariables.colors.categoryBg,
        rgBackground: themeVariables.colors.rgBackground

      },
    },
  };
  // Merge the themes
  const mergedTheme = deepmerge(theme, themeCustom);
  return (
    <CssVarsProvider
      theme={mergedTheme}
      defaultMode={schemeConfig.defaultMode}
      modeStorageKey={schemeConfig.modeStorageKey}
    >
      <CssBaseline />
      <RTL direction={settings.direction}>{children}</RTL>
    </CssVarsProvider>
  );
}
