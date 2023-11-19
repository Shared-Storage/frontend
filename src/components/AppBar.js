import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { FormControl, InputLabel, Select, NativeSelect } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { languageList } from "../utils/LanguageList";

import * as logger from "../utils/logger";
import { logout } from "../services/authentication";
import { authenticationAction } from "../store/auth";
import { preferenceAction } from "../store/preferences";
import * as userService from "../services/user";
import { useTranslation } from "react-i18next";

function ResponsiveAppBar() {
  const { t } = useTranslation(["common"]);
  // const pages = ["Organizations", "Pricing", "Blog"];
  const pages = [];
  const settings = [
    {
      name: t("account"),
      method: () => {
        logger.log("Account clicked");
        handleCloseUserMenu();
        navigate("/user-account");
      },
    },
    {
      name: t("preferences"),
      method: () => {
        logger.log("Preferences clicked");
        handleCloseUserMenu();
        navigate("/preferences");
      },
    },
    {
      name: t("membership"),
      method: () => {
        logger.log("Membership clicked");
        handleCloseUserMenu();
        navigate("/membership");
      },
    },
    {
      name: t("dashboard"),
      method: () => {
        logger.log("Dashboard clicked");
        handleCloseUserMenu();
        navigate("/dashboard");
      },
    },
    {
      name: t("support"),
      method: () => {
        logger.log("Support clicked");
        handleCloseUserMenu();
        navigate("/support");
      },
    },
    {
      name: t("logout"),
      method: () => {
        logger.log("logout clicked");
        handleCloseUserMenu();
        logoutMethod();
      },
    },
  ];
  const dispatch = useDispatch();
  const userPreferences = useSelector((state) => {
    return state.preferences;
  });
  const [loading, setLoading] = React.useState(true);
  const [language, setLanguage] = React.useState("en");

  const logoutMethod = () => {
    // Updates state
    dispatch(authenticationAction.logout());
    // Removes token
    logout();
    navigate("/");
  };
  const navigate = useNavigate();
  const isAuth = useSelector((state) => {
    return state.auth.isAuthenticated;
  });
  const userData = useSelector((state) => {
    return state.user;
  });
  let [authenticated, setAuthenticated] = React.useState(false);
  React.useEffect(() => {
    setAuthenticated(isAuth);
  }, [isAuth]);

  const localStorageLanguage = localStorage.getItem("i18nextLng").slice(0, 2);
  React.useEffect(() => {
    if (authenticated) {
      if (userPreferences.language !== undefined) {
        setLoading(false);
        setLanguage(userPreferences.language);
      }
    } else {
      if (userPreferences.language !== undefined) {
        setLoading(false);
        setLanguage(userPreferences.language);
      } else {
        if (localStorageLanguage) {
          setLoading(false);
          setLanguage(localStorageLanguage);
        } else {
          setLoading(false);
          setLanguage("");
        }
      }
    }
  }, [userPreferences, authenticated, isAuth, localStorageLanguage]);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLanguageChange = (event) => {
    logger.log("handleLanguageChange");
    logger.log(event.target.value);
    setLanguage(event.target.value);
    dispatch(preferenceAction.updateLanguage(event.target.value));
    if (authenticated) {
      userService.updatePreferencesData({
        theme: userPreferences.theme,
        language: event.target.value,
      });
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <WarehouseIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SHARED-STORAGE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {authenticated && (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}

            {authenticated && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
          <WarehouseIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SHARED-STORAGE
          </Typography>
          {!loading && (
            <FormControl style={{ margin: 5 }}>
              <NativeSelect
                label="Language"
                onChange={handleLanguageChange}
                value={language}
                style={{ color: "white" }}
              >
                <option value="">Select Language</option>
                {languageList.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </NativeSelect>
            </FormControl>
          )}
          {authenticated && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          )}

          {authenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={userData.imageUrl} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={setting.method}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
