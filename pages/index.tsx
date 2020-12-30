import { Button, Container, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '../src/next-i18next';

const useStyles = makeStyles((theme) => ({
  heroButtons: {
    marginTop: theme.spacing(8),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  }
}));
const IndexPage = ({t}: WithTranslation) => {
  const classes = useStyles();
  return (
    <>
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography align="center" variant="h2" component="h1">
          {t('title')}
        </Typography>
        <Typography align="center" variant="h5" color="textSecondary">
          {t('subtitle')}
        </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    VIEW COURSES
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    JOIN OUR DISCORD
                  </Button>
                </Grid>
              </Grid>
            </div>
      </Container>
      </div>
    </>
  );
};
IndexPage.getInitialProps = () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(IndexPage)

