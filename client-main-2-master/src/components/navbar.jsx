import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/material/Menu";
import { Link } from "@mui/material";
import { useLocation } from "react-router";
//import { Link } from "react-router-dom";
//import SignUp from './signup';

export default function ButtonAppBar() {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" style={{ backgroundColor: "black" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CUBE
          </Typography>
         {location.pathname === "signup" &&
            <Button
              color="inherit"
              component={Link}
              href="http://localhost:3000/signin"
            >
              {" "}
              Log In
            </Button>
          }{location.pathname !== "signup" &&
            <Button color="inherit" component={Link} href={"/signup"}>
              {" "}
              Create Account
            </Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
