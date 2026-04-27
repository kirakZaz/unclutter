import { Box, Card, CardContent, Typography, Button, Grid, Chip, Avatar, Divider } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Co2Icon from '@mui/icons-material/Co2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import StatCard from '@/components/common/StatCard';
import { getEvents, getCommunityPosts, getCommunityImpact } from '@/services/localDbService';

function HomePage() {
  const { currentUser } = useAuth();

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const { data: communityPosts = [] } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => getCommunityPosts(),
  });

  const { data: impact } = useQuery({
    queryKey: ['communityImpact'],
    queryFn: getCommunityImpact,
  });

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentPosts = communityPosts.slice(0, 4);

  return (
    <Box>
      {/* Hero banner — community-first */}
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #52B788 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: -60,
            top: -60,
            width: 280,
            height: 280,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: -40,
            bottom: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.03)',
          },
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', mb: 1, maxWidth: 560 }}>
          Welcome back, {currentUser?.name?.split(' ')[0]}
        </Typography>
        <Typography sx={{ opacity: 0.92, mb: 3, maxWidth: 540, fontSize: '1.05rem', lineHeight: 1.7 }}>
          Clutter isn't a personal problem — it's a community one.
          Every item you share here goes to a real neighbour, not an anonymous warehouse.
          That's what makes this different.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/give-receive"
            variant="contained"
            sx={{ bgcolor: 'white', color: 'primary.dark', fontWeight: 700, '&:hover': { bgcolor: 'grey.100' } }}
          >
            Share an item
          </Button>
          <Button
            component={RouterLink}
            to="/communities"
            variant="outlined"
            sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white' } }}
          >
            Find your community
          </Button>
        </Box>
      </Box>

      {/* Mission statement */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          bgcolor: 'rgba(45,106,79,0.04)',
          border: '1px solid rgba(45,106,79,0.12)',
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 32, flexShrink: 0, mt: 0.5 }} />
        <Box>
          <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.8, color: 'text.primary', mb: 1 }}>
            "We don't just move items — we build connections. When you give a coat to a neighbour
            instead of a bin, when you fix a toaster with a stranger who becomes a friend,
            when you swap stories alongside clothes — that's community infrastructure."
          </Typography>
          <Typography variant="caption" color="text.secondary">
            The Unclutter Manifesto — Inner North Melbourne
          </Typography>
        </Box>
      </Box>

      {/* Neighbourhood impact — community metrics */}
      {impact && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Our neighbourhood, together
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', bgcolor: 'rgba(45,106,79,0.04)', border: '1px solid rgba(45,106,79,0.12)' }}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h3" color="primary.main" fontWeight={700}>
                    {impact.totalItemsCirculated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    items circulated
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', bgcolor: 'rgba(45,106,79,0.04)', border: '1px solid rgba(45,106,79,0.12)' }}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h3" color="primary.main" fontWeight={700}>
                    {impact.totalMembers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    neighbours connected
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', bgcolor: 'rgba(82,183,136,0.06)', border: '1px solid rgba(82,183,136,0.15)' }}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h3" sx={{ color: '#52B788' }} fontWeight={700}>
                    {impact.totalCo2Saved.toFixed(0)}
                    <Typography component="span" variant="body2" sx={{ color: '#52B788' }}> kg</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CO2 saved together
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', bgcolor: 'rgba(212,137,106,0.06)', border: '1px solid rgba(212,137,106,0.15)' }}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h3" sx={{ color: '#D4896A' }} fontWeight={700}>
                    {impact.activeHubs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    active hubs nearby
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Your personal impact */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your impact
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<VolunteerActivismIcon />}
            label="Items given"
            value={currentUser?.stats.itemsGiven ?? 0}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<SwapHorizIcon />}
            label="Items received"
            value={currentUser?.stats.itemsReceived ?? 0}
            color="#D4896A"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<Co2Icon />}
            label="kg CO2 saved"
            value={currentUser?.stats.co2Saved ?? 0}
            color="#52B788"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Community stories — the heart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h6">Neighbour stories</Typography>
                <Button component={RouterLink} to="/communities" size="small">
                  All communities
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Real people sharing real things — this is what community looks like.
              </Typography>
              {recentPosts.length === 0 ? (
                <Typography color="text.secondary">No recent activity.</Typography>
              ) : (
                recentPosts.map((post, index) => (
                  <Box key={post.id}>
                    <Box
                      sx={{
                        py: 2,
                        '&:hover': { bgcolor: 'rgba(45,106,79,0.02)' },
                        borderRadius: 2,
                        px: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                            bgcolor: 'primary.main',
                          }}
                        >
                          {post.authorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {post.authorName}
                          </Typography>
                          <Chip
                            label={post.communityName}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 18, bgcolor: 'rgba(45,106,79,0.08)', color: 'primary.main' }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7, mb: 0.8 }}
                      >
                        {post.content}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FavoriteIcon sx={{ fontSize: 13, color: '#C44B4B' }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.likes}
                        </Typography>
                      </Box>
                    </Box>
                    {index < recentPosts.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming events */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h6">Upcoming events</Typography>
                <Button component={RouterLink} to="/events" size="small">
                  See all
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Meet your neighbours in person.
              </Typography>
              {upcomingEvents.length === 0 ? (
                <Typography color="text.secondary">No upcoming events.</Typography>
              ) : (
                upcomingEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'rgba(45,106,79,0.04)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'rgba(45,106,79,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ lineHeight: 1 }}>
                        {new Date(event.date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric' })}
                      </Typography>
                      <Typography variant="caption" color="primary.main" sx={{ fontSize: '0.6rem', lineHeight: 1 }}>
                        {new Date(event.date + 'T00:00:00').toLocaleDateString('en-AU', { month: 'short' })}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {event.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {event.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${event.attendees} going`}
                      size="small"
                      sx={{ fontSize: '0.6rem', height: 20, bgcolor: 'rgba(45,106,79,0.08)', color: 'primary.main', flexShrink: 0 }}
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom CTA — community call */}
      <Box
        sx={{
          mt: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(45,106,79,0.06) 0%, rgba(82,183,136,0.08) 100%)',
          border: '1px solid rgba(45,106,79,0.12)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          The best way to declutter is together
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          Sharing isn't just about moving stuff — it's about knowing your neighbours,
          building trust, and creating a place where everyone has enough.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={RouterLink} to="/give-receive" variant="contained">
            Give or receive an item
          </Button>
          <Button component={RouterLink} to="/hubs" variant="outlined">
            Find a hub near you
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
