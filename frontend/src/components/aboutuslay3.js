import React from "react";
import { Typography, Container, Grid, Box, IconButton } from "@mui/material";
import { LinkedIn, Twitter, Instagram } from "@mui/icons-material";

function aboutuslay3() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="left" sx={{ paddingBottom: '2rem' }} gutterBottom>
        <strong>Introducing the team</strong>
      </Typography>
      <div className="aboutl3">
        <Grid container spacing={10} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box textAlign="justify" style={developerCardStyle}>
              <img src="Gourav.jpg" alt="Gourav Midya" className="aboutimage2" style={imageStyle} />
              <Typography variant="h6" gutterBottom>
                <strong>Gourav Midya</strong>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Co-Founder
              </Typography>
              <Typography variant="body1" textAlign="justify" gutterBottom>
                “With innovation as our compass and plants as our passion, we're leading the charge towards a greener, more sustainable future.”
              </Typography>
              <div style={socialIconsStyle}>
                <IconButton aria-label="LinkedIn" color="primary">
                  <LinkedIn />
                </IconButton>
                <IconButton aria-label="Twitter" color="primary">
                  <Twitter />
                </IconButton>
                <IconButton aria-label="Instagram" color="primary">
                  <Instagram />
                </IconButton>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="justify" style={developerCardStyle}>
              <img src="Prathamesh.jpg" alt="Prathamesh Naik" className="aboutimage2" style={imageStyle} />
              <Typography variant="h6" gutterBottom>
                <strong>Prathamesh Naik</strong>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Co-Founder
              </Typography>
              <Typography variant="body1" textAlign="justify" gutterBottom>
                "In a world of complexities, we thrive on simplifying the plant care experience for our users and paving the way for effortless greenery."
              </Typography>
              <div style={socialIconsStyle}>
                <IconButton aria-label="LinkedIn" color="primary">
                  <LinkedIn />
                </IconButton>
                <IconButton aria-label="Twitter" color="primary">
                  <Twitter />
                </IconButton>
                <IconButton aria-label="Instagram" color="primary">
                  <Instagram />
                </IconButton>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="justify" style={developerCardStyle}>
              <img src="Harsh.jpg" alt="Harsh Maurya" className="aboutimage2" style={imageStyle} />
              <Typography variant="h6" gutterBottom>
                <strong>Harsh Maurya</strong>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Co-Founder
              </Typography>
              <Typography variant="body1" textAlign="justify" gutterBottom>
              “Through precise analysis of problems, we gain insights that fuel innovation and enhance our products.”
              </Typography>
              <div style={socialIconsStyle}>
                <IconButton aria-label="LinkedIn" color="primary">
                  <LinkedIn />
                </IconButton>
                <IconButton aria-label="Twitter" color="primary">
                  <Twitter />
                </IconButton>
                <IconButton aria-label="Instagram" color="primary">
                  <Instagram />
                </IconButton>
              </div>
            </Box>
          </Grid>
        </Grid>
      </div>
      <br/>
    </Container>
  );
}

export default aboutuslay3;

const developerCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
};

const imageStyle = {
  width: '100%',
  height: '20%',
  borderRadius: '1rem',
  marginBottom: '1rem',
};

const socialIconsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
};
