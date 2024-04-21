import React from "react";
import { Typography, Container, Grid } from "@mui/material";

function aboutuslay1() {
  return (
    <Container maxWidth="lg" sx={{padding:'3rem'}}>
      <Grid container spacing={2} alignItems="center">
      <Container maxWidth="md" sx={{padding:'1rem'}}>
      
        <Grid item xs={12}>
          <Typography variant="h3" align="center" gutterBottom>
            <strong>Cultivating Innovation<br />Nurturing Passion</strong>
          </Typography>
        </Grid>
        <Grid variant="h4" item xs={12}>
          <Typography align="center" paragraph>
            At BloomBuddy, we exist to empower plant enthusiasts and gardening aficionados with innovative technology that simplifies and enhances the joy of nurturing greenery. Our mission is to revolutionize the way people care for plants by providing intelligent monitoring systems that offer real-time insights, foster sustainable practices, and cultivate thriving indoor and outdoor ecosystems. We are committed to fostering a deeper connection between individuals and nature, enriching lives through the beauty and vitality of plants.
          </Typography>
        </Grid>
        </Container>
        <Grid item xs={12}>
          <img src="1.jpg" alt="Your Image" className="aboutimage" style={{ maxWidth: "100%"}} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default aboutuslay1;
