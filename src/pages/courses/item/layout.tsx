import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { CoursePartItemRoute, CoursePartParamTypes } from "./route";
import CoursePartItem from "../../../models/items/item";
import {
  Hidden,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  AppBar,
  Box,
  Typography,
  Grid,
  IconButton,
} from "@material-ui/core";
import theme from "../../../theme";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useParams,
  useRouteMatch,
  withRouter,
} from "react-router-dom";
import CoursePartItemIcon from "../../../components/icon";
import CoursePart from "../../../models/part";
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
    indicator: {
      left: "0px",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      overflow: "auto",
    },
  })
);
interface Props extends RouteComponentProps {
  parts: CoursePart[];
}

export function CoursePartItemLayout({ parts, history }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  let match = useRouteMatch<CoursePartParamTypes>({
    path: `/courses/:serverId/:courseId/start/:partId/:itemId`,
  });
  const { serverId, courseId, partId } = useParams<CoursePartParamTypes>();
  let { path } = useRouteMatch();
  const part = parts.find((part) => part.slug === partId);

  let item: CoursePartItem = part.items[match?.params?.itemId];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleCallToRouter = (_event: React.ChangeEvent<{}>, value: any) => {
    history.push(value);
  };
  const handlePartCallToRouter = (
    _event: React.ChangeEvent<{}>,
    value: any
  ) => {
    history.push(`/courses/${serverId}/${part.course.slug}/start/${value}`);
  };

  const classes = useStyles();
  const drawer = (
    <>
      <Toolbar />
      <div className={classes.drawerContainer}>
        {parts == null ? (
          <CircularProgress />
        ) : (
          <Tabs
            classes={{
              indicator: classes.indicator,
            }}
            orientation="vertical"
            variant="scrollable"
            onChange={handlePartCallToRouter}
            value={part.slug}
          >
            {parts.map((part) => (
              <Tab label={part.name} key={part.slug} value={part.slug} />
            ))}
          </Tabs>
        )}
        {/* <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </div>
    </>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={window.document.body}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <AppBar position="sticky" color="default">
          <Tabs
            onChange={handleCallToRouter}
            value={history.location.pathname}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            {part.items
              .filter((current) => current != null)
              .map((current, index) => (
                <Tab
                  key={current.name}
                  label={current.name}
                  icon={<CoursePartItemIcon item={current} />}
                  value={`/courses/${serverId}/${current.part.course.slug}/start/${current.part.slug}/${index}`}
                />
              ))}
          </Tabs>
        </AppBar>
        <Paper elevation={3}>
          <Box p={2}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box p={4}>
            {item != null && (
              <Paper elevation={3}>
                <Grid container spacing={4} alignItems="stretch">
                  <Grid item lg={4} md={5} sm={12} container direction="column">
                    <Box p={2}>
                      <Typography variant="h3" component="h2">
                        {item.name}
                      </Typography>
                      <Typography component="p">{item.description}</Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={8} md={7} sm={12}>
                    <Box p={2}>
                      <Switch>
                        <Route path={`${path}/:itemId`}>
                          <CoursePartItemRoute part={part} />
                        </Route>
                        <Route
                          path={path}
                          exact
                          render={({ location }) => (
                            <Redirect
                              to={{
                                pathname: `/courses/${serverId}/${courseId}/start/${partId}/0`,
                                state: { from: location },
                              }}
                            />
                          )}
                        />
                      </Switch>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
        </Paper>
      </main>
    </div>
  );
}
export default withRouter(CoursePartItemLayout);