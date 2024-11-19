import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';

export default function MenuAppBar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" sx={{ bgcolor: 'darkblue' }}>
      <Toolbar>
        <Link to="/map" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MapIcon />
        </Link>
        <Typography
          variant="button"
          component="div"
          sx={{ flexGrow: 1, ml: 5, textTransform: 'uppercase' }}
        >
          {'RoadTrip Planner'}
        </Typography>

        <Box>
          <IconButton
            size="large"
            color="inherit"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => navigate('/account')}
            sx={{ mr: 2, ml: 5 }}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
