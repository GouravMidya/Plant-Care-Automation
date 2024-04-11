import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  palette: {
    primary: {
      main: '#008000',
    },
    secondary: {
      main: '#9ef01a', 
    },
    other:{
      main: '#ff4d6d'
    }
  },
});

export default appTheme;