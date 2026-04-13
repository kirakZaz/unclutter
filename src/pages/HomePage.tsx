import { Box, Card, CardContent, Typography, Button, Grid, Chip, Avatar } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Co2Icon from '@mui/icons-material/Co2';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import StatCard from '@/components/common/StatCard';
import { getChallenges, getCommunityPosts } from '@/services/localDbService';

function HomePage() {
  const { currentUser } = useAuth();

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: getChallenges,
  });

  const { data: communityPosts = [] } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => getCommunityPosts(),
  });

  const activeChallenges = challenges.filter((challenge) => challenge.isActive);
  const recentPosts = communityPosts.slice(0, 3);

  return (
    <Box>
      {/* Welcome banner */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.07)',
          },
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
          Hello, {currentUser?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography sx={{ opacity: 0.85, mb: 3, maxWidth: 480 }}>
          You're part of something bigger. Connect with people in your area, share what you no
          longer need, and make a real difference together.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/communities"
            variant="contained"
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
          >
            Find your community
          </Button>
          <Button
            component={RouterLink}
            to="/exchange"
            variant="outlined"
            sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white' } }}
          >
            Post an item
          </Button>
        </Box>
      </Box>

      {/* Personal stats */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your impact
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<SwapHorizIcon />}
            label="Items given away"
            value={currentUser?.stats.itemsGiven ?? 0}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<VolunteerActivismIcon />}
            label="Items received"
            value={currentUser?.stats.itemsReceived ?? 0}
            color="#D4896A"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<Co2Icon />}
            label="kg CO₂ saved"
            value={currentUser?.stats.co2Saved ?? 0}
            color="#52B788"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active challenges */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Active challenges</Typography>
                <Button component={RouterLink} to="/challenges" size="small">
                  See all
                </Button>
              </Box>
              {activeChallenges.length === 0 ? (
                <Typography color="text.secondary">No active challenges right now.</Typography>
              ) : (
                activeChallenges.map((challenge) => (
                  <Box
                    key={challenge.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { bgcolor: 'rgba(45,106,79,0.04)' },
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'rgba(45,106,79,0.1)', fontSize: '1.4rem' }}>
                      {challenge.badge}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {challenge.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {challenge.participants.toLocaleString()} participants
                      </Typography>
                    </Box>
                    <Chip
                      label={challenge.difficulty}
                      size="small"
                      color={
                        challenge.difficulty === 'easy'
                          ? 'success'
                          : challenge.difficulty === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Community activity feed */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Community activity</Typography>
                <Button component={RouterLink} to="/communities" size="small">
                  All communities
                </Button>
              </Box>
              {recentPosts.length === 0 ? (
                <Typography color="text.secondary">No recent activity.</Typography>
              ) : (
                recentPosts.map((post) => (
                  <Box
                    key={post.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'rgba(45,106,79,0.04)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: '0.7rem',
                          bgcolor: 'primary.main',
                        }}
                      >
                        {post.authorName.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" fontWeight={600}>
                        {post.authorName}
                      </Typography>
                      <Chip
                        label={post.communityName}
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 18, bgcolor: 'rgba(45,106,79,0.08)', color: 'primary.main' }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                        mb: 0.5,
                      }}
                    >
                      {post.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FavoriteIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                      <Typography variant="caption" color="text.disabled">
                        {post.likes}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
