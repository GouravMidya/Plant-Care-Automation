import React from "react";
import { Typography, Container, Grid, Box } from "@mui/material";

function aboutuslay2() {
  return (
    <Container maxWidth="lg" sx={{padding:'3rem'}}>
      <Typography variant="h4" align="left" gutterBottom>
        <strong>Rooted in Values: Our Guiding Principles</strong>
      </Typography>

      <Grid container spacing={5} sx={{paddingTop:'1rem'}}>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <img src="2.jpg" alt="Your Image" className="aboutimage2" style={{ maxWidth: "100%", marginBottom: "10px",  borderRadius: "9px" }} />
            <Typography variant="h6" gutterBottom>
              <strong>Passion for Plants</strong>
            </Typography>
            <Typography align="center" paragraph>
              Our deep-seated passion for plants drives everything we do. We are dedicated to fostering a love for greenery and cultivating thriving ecosystems.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <img src="3.jpg" alt="Your Image" className="aboutimage3" style={{ maxWidth: "100%", marginBottom: "10px", borderRadius: "9px" }} />
            <Typography variant="h6" gutterBottom>
            <strong>Innovation</strong>
            </Typography>
            <Typography align="center" paragraph>
              Innovation is at the core of our company. We are committed to pushing the boundaries of plant care technology, constantly seeking new ways to enhance the experience for our users.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <img src="4.jpg" alt="Your Image" className="aboutimage4" style={{ maxWidth: "100%", marginBottom: "10px",  borderRadius: "9px" }} />
            <Typography variant="h6" gutterBottom>
            <strong>Environmental Stewardship</strong>
            </Typography>
            <Typography align="center" paragraph>
              We prioritize environmental sustainability in all aspects of our business. We are dedicated to promoting responsible gardening practices and minimizing our ecological footprint to preserve the planet for future generations.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default aboutuslay2;
