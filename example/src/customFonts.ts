import { beyondWonderlandFontFace } from './fonts/beyond-wonderland';
import { calibreLightFontFace,calibreRegularFontFace } from './fonts/calibre';

export const customFonts:{ name: string, css: string }[] = [
  {
    name: 'Beyond Wonderland',
    css: beyondWonderlandFontFace,
  },
  {
    name: 'CalibreLight',
    css: calibreLightFontFace,
  },
  {
    name: 'CalibreRegular',
    css: calibreRegularFontFace,
  },
];
