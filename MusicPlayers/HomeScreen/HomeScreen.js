import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, List, ListItem, Divider } from '@material-ui/core';
import { Menu as MenuIcon, PlayArrow as PlayArrowIcon, Search as SearchIcon } from '@material-ui/icons';

const HomeScreen = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Home Screen
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <SearchIcon />
          <input type="text" placeholder="Search for a Song, Artist..." />
        </div>
        {/* Filter Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <Button variant="contained" color="primary">Jazz</Button>
          <Button variant="contained" color="primary">Hip-hop</Button>
          <Button variant="contained" color="primary">Classic</Button>
          <Button variant="contained" color="primary">Rock</Button>
        </div>
        {/* Playlists */}
        <Typography variant="h5" style={{ marginBottom: '10px' }}>Popular Playlist</Typography>
        <List>
          <ListItem>
            <PlayArrowIcon />
            <div>PLAYLIST NAME</div>
          </ListItem>
          <Divider />
          {/* ... other playlist items */}
        </List>
      </div>
    </div>
  );
}

export default HomeScreen;
