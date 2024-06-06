import React, { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import CloseMenu from '@mui/icons-material/ArrowLeft';
import OpenMenu from '@mui/icons-material/ArrowRight';
import { Routes, Route, Navigate } from 'react-router-dom';
import Coupons from "../../inputs/coupons"
import Partners from "../../inputs/partners"
import Sidebar from './components/Sidebar';
import OrderTable from './components/OrderTable';
import OrderList from './components/OrderList';
import Header from './components/Header';
import Dash from '../dash';

import apiRequest from '../../../modules/apiRequest';

export default function JoyOrderDashboardTemplate() {
  const [usersData, setUsersData] = useState([]);
  const [menu, setMenu] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiRequest('/api/directus/all-users', '', 'GET');
      setUsersData(response);
    };

    fetchData();
  }, []);

  function getFormattedUrlPart() {
    const url = window.location.href;
    const part = url.substring(url.lastIndexOf('/') + 1);
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }
 

  function showMenu(e) {
    if (e === 0) {
      setMenu(false);
    } else {
      setMenu(true);
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Header />
        {menu && <Sidebar usersData={usersData}/>}
        <Chip style={{ height: '10px', cursor: 'pointer' }}>
          {menu ? <CloseMenu onClick={() => showMenu(0)} /> : <OpenMenu onClick={() => showMenu(1)} />}
        </Chip>
      </CssVarsProvider>
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: 'calc(12px + var(--Header-height))',
            sm: 'calc(12px + var(--Header-height))',
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100dvh',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        </Box>
        <Box
          sx={{
            display: 'flex',
            mb: 1,
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography level="h2" component="h1">
            {getFormattedUrlPart()}
          </Typography>         
        </Box>
        <Routes>
          <Route path="/" element={<Navigate to="cadastramento" />} />
          <Route path="cadastramento" element={<Dash />} />
          <Route path="cupons" element={<Coupons usersData={usersData} />} />
          <Route path="parceiros" element={<Partners usersData={usersData} />} />
        </Routes>
      </Box>
    </Box>
  );
}
