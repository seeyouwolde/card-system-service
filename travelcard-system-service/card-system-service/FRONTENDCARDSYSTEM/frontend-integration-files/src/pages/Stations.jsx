import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TrainRoundedIcon from '@mui/icons-material/TrainRounded';

import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { getStationsAndZones } from '../api/travelCardApi';

const COLUMNS = [
  {
    id: 'stationName',
    label: 'Station Name',
    minWidth: 200,
    render: (val) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            backgroundColor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <TrainRoundedIcon fontSize="small" />
        </Box>
        <Typography variant="body2" fontWeight={600}>
          {val}
        </Typography>
      </Box>
    ),
  },
  {
    id: 'zones',
    label: 'Fare Zones',
    minWidth: 250,
    render: (zones) => (
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
        {zones.map((zone) => (
          <Chip
            key={zone}
            label={`Zone ${zone}`}
            size="small"
            color="primary"
            variant="soft"
            sx={{ 
              fontWeight: 700, 
              fontSize: '0.7rem',
              borderRadius: 1.5,
              textTransform: 'uppercase'
            }}
          />
        ))}
      </Box>
    ),
  },
];

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getStationsAndZones();
        // Add an index-based ID for DataTable
        const dataWithIds = (response.data ?? []).map((s, idx) => ({
          ...s,
          id: idx
        }));
        setStations(dataWithIds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Box>
      <PageHeader
        title="Stations & Zones"
        subtitle="Reference data for all transit locations and their associated fare zones"
      />

      {error ? (
        <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'error.lighter', borderRadius: 2 }}>
          <Typography color="error" variant="body2" fontWeight={600}>
            {error}
          </Typography>
        </Box>
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={stations}
          searchableFields={['stationName']}
          loading={loading}
          emptyMessage="No stations found in the transit network."
        />
      )}
    </Box>
  );
}
