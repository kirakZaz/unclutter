import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Skeleton,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useQuery } from '@tanstack/react-query';
import { getHubLocations } from '@/services/localDbService';
import SectionHeader from '@/components/common/SectionHeader';
import type { HubType } from '@/types';

const HUB_CONFIG: Record<HubType, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  'drop-off': {
    label: 'Drop-off Point',
    color: '#2D6A4F',
    icon: <InventoryIcon sx={{ fontSize: 20 }} />,
    description: 'Staffed locations accepting items',
  },
  'charity-partner': {
    label: 'Charity Partner',
    color: '#9E7AB3',
    icon: <StorefrontIcon sx={{ fontSize: 20 }} />,
    description: 'Partner op-shops and charities',
  },
  'repair-cafe': {
    label: 'Repair Cafe',
    color: '#D4896A',
    icon: <BuildIcon sx={{ fontSize: 20 }} />,
    description: 'Get items fixed for free',
  },
  'circular-van': {
    label: 'Circular Route Van',
    color: '#52B788',
    icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
    description: 'Mobile collection service',
  },
};

const ALL_HUB_TYPES: HubType[] = ['drop-off', 'charity-partner', 'repair-cafe', 'circular-van'];

function HubMapPage() {
  const [activeType, setActiveType] = React.useState<string>('all');

  const { data: hubs = [], isLoading } = useQuery({
    queryKey: ['hubLocations'],
    queryFn: getHubLocations,
  });

  const filteredHubs = activeType === 'all'
    ? hubs
    : hubs.filter((h) => h.type === activeType);

  const hubsBySuburb = filteredHubs.reduce<Record<string, typeof filteredHubs>>((acc, hub) => {
    if (!acc[hub.suburb]) acc[hub.suburb] = [];
    acc[hub.suburb].push(hub);
    return acc;
  }, {});

  return (
    <Box>
      <SectionHeader
        title="Local Hub Locator"
        subtitle="Find the nearest drop-off points, charity partners, repair cafes, and Circular Route Van stops in Inner North Melbourne"
      />

      {/* Overview cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {ALL_HUB_TYPES.map((type) => {
          const config = HUB_CONFIG[type];
          const count = hubs.filter((h) => h.type === type).length;
          const isActive = activeType === type;
          return (
            <Grid item xs={6} sm={3} key={type}>
              <Card
                onClick={() => setActiveType(isActive ? 'all' : type)}
                sx={{
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: isActive ? config.color : 'transparent',
                  bgcolor: isActive ? `${config.color}08` : 'background.paper',
                  '&:hover': { borderColor: config.color },
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                  <Box sx={{ color: config.color, mb: 0.5 }}>{config.icon}</Box>
                  <Typography variant="h5" sx={{ color: config.color, fontWeight: 700 }}>
                    {count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {config.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Banner */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          mb: 3,
          bgcolor: 'rgba(82,183,136,0.08)',
          border: '1px solid rgba(82,183,136,0.2)',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Not sure where to take your items? These hubs solve the #1 barrier to decluttering: <strong>"I don't know where to take things."</strong> Every location listed here is verified and currently accepting items.
        </Typography>
      </Box>

      {/* Hubs by suburb */}
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Card><CardContent>
                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="50%" />
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        Object.entries(hubsBySuburb)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([suburb, suburbHubs]) => (
            <Box key={suburb} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                {suburb}
              </Typography>
              <Grid container spacing={2}>
                {suburbHubs.map((hub) => {
                  const config = HUB_CONFIG[hub.type];
                  return (
                    <Grid item xs={12} sm={6} key={hub.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: `${config.color}15`,
                                color: config.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {config.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2" noWrap>
                                {hub.name}
                              </Typography>
                              <Chip
                                label={config.label}
                                size="small"
                                sx={{
                                  bgcolor: `${config.color}15`,
                                  color: config.color,
                                  fontWeight: 600,
                                  fontSize: '0.65rem',
                                  height: 18,
                                }}
                              />
                            </Box>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                            {hub.description}
                          </Typography>

                          <Divider sx={{ mb: 1.5 }} />

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOnIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {hub.address}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {hub.hours}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
                            {hub.acceptedItems.map((item) => (
                              <Chip
                                key={item}
                                label={item}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.65rem', height: 20 }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))
      )}
    </Box>
  );
}

export default HubMapPage;
