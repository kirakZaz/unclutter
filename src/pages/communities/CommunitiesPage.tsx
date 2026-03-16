import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Skeleton,
  Avatar,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunities, joinCommunity } from '@/services/localDbService';
import SectionHeader from '@/components/common/SectionHeader';

const CATEGORY_COLORS: Record<string, string> = {
  local: '#2D6A4F',
  repair: '#D4896A',
  lifestyle: '#E8C84E',
  fashion: '#C44B4B',
  food: '#52B788',
  general: '#9E7AB3',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  local: '📍',
  repair: '🔧',
  lifestyle: '🌿',
  fashion: '👗',
  food: '🌾',
  general: '💬',
};

function CommunitiesPage() {
  const queryClient = useQueryClient();
  const [joinedIds, setJoinedIds] = React.useState<Set<string>>(new Set());

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: getCommunities,
  });

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: (_, communityId) => {
      setJoinedIds((prev) => new Set(prev).add(communityId));
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  return (
    <Box>
      <SectionHeader
        title="Communities"
        subtitle="Find and connect with local and interest-based groups"
      />

      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="70%" height={28} />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : communities.map((community) => {
              const isJoined = joinedIds.has(community.id);
              const categoryColor = CATEGORY_COLORS[community.category] ?? '#9E7AB3';
              const categoryEmoji = CATEGORY_EMOJIS[community.category] ?? '💬';

              return (
                <Grid item xs={12} sm={6} md={4} key={community.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${categoryColor}18`,
                            color: categoryColor,
                            width: 48,
                            height: 48,
                            fontSize: '1.4rem',
                            flexShrink: 0,
                          }}
                        >
                          {categoryEmoji}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1.3 }}>
                            {community.name}
                          </Typography>
                          <Chip
                            label={community.category}
                            size="small"
                            sx={{
                              mt: 0.5,
                              bgcolor: `${categoryColor}18`,
                              color: categoryColor,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        {community.description}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {community.members.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {community.location}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          variant={isJoined ? 'outlined' : 'contained'}
                          color="primary"
                          onClick={() => joinMutation.mutate(community.id)}
                          disabled={isJoined || joinMutation.isPending}
                        >
                          {isJoined ? 'Joined' : 'Join'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
    </Box>
  );
}

export default CommunitiesPage;
