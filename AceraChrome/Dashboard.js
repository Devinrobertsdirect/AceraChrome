import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Typography variant="h4">Dashboard</Typography>
                <Typography variant="h6">Welcome, User!</Typography>
            </Box>
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={4}>
                    <Link to="/ai-assist" style={{ textDecoration: 'none' }}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: 'lightblue' }}>
                            <Typography variant="h6">AI Assistant</Typography>
                        </Paper>
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Link to="/internet" style={{ textDecoration: 'none' }}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: 'lightpurple' }}>
                            <Typography variant="h6">Internet</Typography>
                        </Paper>
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Link to="/lamp" style={{ textDecoration: 'none' }}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: 'lightyellow' }}>
                            <Typography variant="h6">Lamp</Typography>
                        </Paper>
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
