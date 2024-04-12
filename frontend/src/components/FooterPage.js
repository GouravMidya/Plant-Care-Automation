// Footer component
import { Grid, Typography } from '@mui/material';
const FooterPage = () => {
    return (
      <footer style={{ backgroundColor: '#2e7d32', textAlign: 'center', padding: '15px' }}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid paddingInline={2}>
          <img src={'favicon.ico'} alt="BloomBuddy Logo" style={{ maxWidth: '2rem' }} />
        </Grid>
        <Grid >
          <Typography color={'white'} style={{ textDecoration: 'none' }}>
            <strong>©2024 BloomBuddy All rights reserved.</strong>
          </Typography>
        </Grid>
      </Grid>
    </footer>
    );
  };

export default FooterPage;
