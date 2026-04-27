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
  LinearProgress,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvents, joinEvent } from '@/services/localDbService';
import SectionHeader from '@/components/common/SectionHeader';
import type { EventCategory } from '@/types';

const CATEGORY_CONFIG: Record<EventCategory, { label: string; color: string; emoji: string }> = {
  'swap-meet': { label: 'Swap Meet', color: '#2D6A4F', emoji: '🔄' },
  'repair-cafe': { label: 'Repair Cafe', color: '#D4896A', emoji: '🔧' },
  'skill-share': { label: 'Skill Share', color: '#9E7AB3', emoji: '🎓' },
  'workshop': { label: 'Workshop', color: '#E8C84E', emoji: '🛠️' },
  'social': { label: 'Social', color: '#52B788', emoji: '🌿' },
};

const ALL_CATEGORIES: EventCategory[] = ['swap-meet', 'repair-cafe', 'skill-share', 'workshop', 'social'];

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function EventsPage() {
  const queryClient = useQueryClient();
  const [joinedIds, setJoinedIds] = React.useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const joinMutation = useMutation({
    mutationFn: joinEvent,
    onSuccess: (_, eventId) => {
      setJoinedIds((prev) => new Set(prev).add(eventId));
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter((e) => e.category === activeCategory);

  const upcomingEvents = filteredEvents
    .filter((e) => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Box>
      <SectionHeader
        title="Community Events"
        subtitle="Swap meets, repair cafes, and skill-sharing sessions happening near you"
      />

      {/* Category filter */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Chip
          label="All Events"
          onClick={() => setActiveCategory('all')}
          sx={{
            cursor: 'pointer',
            fontWeight: activeCategory === 'all' ? 700 : 400,
            bgcolor: activeCategory === 'all' ? 'primary.main' : 'rgba(45,106,79,0.08)',
            color: activeCategory === 'all' ? 'white' : 'primary.main',
            '&:hover': { bgcolor: activeCategory === 'all' ? 'primary.main' : 'rgba(45,106,79,0.15)' },
          }}
        />
        {ALL_CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = activeCategory === cat;
          return (
            <Chip
              key={cat}
              label={`${config.emoji} ${config.label}`}
              onClick={() => setActiveCategory(cat)}
              sx={{
                cursor: 'pointer',
                fontWeight: isActive ? 700 : 400,
                bgcolor: isActive ? config.color : `${config.color}14`,
                color: isActive ? 'white' : config.color,
                '&:hover': { bgcolor: isActive ? config.color : `${config.color}24` },
              }}
            />
          );
        })}
      </Box>

      {/* Events grid */}
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Card><CardContent>
                <Skeleton variant="text" width="80%" height={28} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="60%" />
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>
      ) : upcomingEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No upcoming events in this category.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {upcomingEvents.map((event) => {
            const config = CATEGORY_CONFIG[event.category];
            const isJoined = joinedIds.has(event.id);
            const capacityPercent = Math.round((event.attendees / event.maxCapacity) * 100);
            const spotsLeft = event.maxCapacity - event.attendees;

            return (
              <Grid item xs={12} sm={6} key={event.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Chip
                        label={`${config.emoji} ${config.label}`}
                        size="small"
                        sx={{
                          bgcolor: `${config.color}18`,
                          color: config.color,
                          fontWeight: 600,
                        }}
                      />
                      {event.isFree && (
                        <Chip label="Free" size="small" color="success" variant="outlined" />
                      )}
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {event.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                    </Box>

                    {event.communityName && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        Hosted by {event.communityName}
                      </Typography>
                    )}

                    <Divider sx={{ mb: 1.5 }} />

                    <Box sx={{ mb: 0.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.attendees} attending
                          </Typography>
                        </Box>
                        <Typography variant="caption" color={spotsLeft < 5 ? 'error.main' : 'text.secondary'}>
                          {spotsLeft} spots left
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={capacityPercent}
                        sx={{ borderRadius: 4, height: 4 }}
                      />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant={isJoined ? 'outlined' : 'contained'}
                        size="small"
                        onClick={() => joinMutation.mutate(event.id)}
                        disabled={isJoined || spotsLeft === 0 || joinMutation.isPending}
                      >
                        {isJoined ? 'Attending' : spotsLeft === 0 ? 'Full' : 'Join event'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default EventsPage;
