import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Skeleton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChallenges, joinChallenge } from '@/services/localDbService';
import SectionHeader from '@/components/common/SectionHeader';
import type { ChallengeDifficulty } from '@/types';

const DIFFICULTY_CONFIG: Record<ChallengeDifficulty, { color: 'success' | 'warning' | 'error'; label: string }> = {
  easy: { color: 'success', label: 'Easy' },
  medium: { color: 'warning', label: 'Medium' },
  hard: { color: 'error', label: 'Hard' },
};

function getProgressPercent(startDate: string, endDate: string): number {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function ChallengesPage() {
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: getChallenges,
  });

  const joinMutation = useMutation({
    mutationFn: joinChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const activeChallenges = challenges.filter((c) => c.isActive);
  const pastChallenges = challenges.filter((c) => !c.isActive);

  console.log('joinedIds', activeChallenges);

  return (
    <Box>
      <SectionHeader
        title="Challenges"
        subtitle="Push yourself, track progress and earn badges for decluttering milestones"
      />

      {activeChallenges.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🔥 Active now
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {isLoading
              ? Array.from({ length: 2 }).map((_, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card>
                      <CardContent>
                        <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width="80%" height={28} />
                        <Skeleton variant="text" />
                        <Skeleton variant="rounded" height={8} sx={{ mt: 2, mb: 1 }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : activeChallenges.map((challenge) => {

                  const progressPercent = getProgressPercent(challenge.startDate, challenge.endDate);
                  const difficultyConfig = DIFFICULTY_CONFIG[challenge.difficulty];

                  return (
                    <Grid item xs={12} sm={6} key={challenge.id}>
                      <Card
                        sx={{
                          height: '100%',
                          border: '2px solid',
                          borderColor: 'primary.light',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                bgcolor: 'rgba(45,106,79,0.1)',
                                fontSize: '2rem',
                              }}
                            >
                              {challenge.badge}
                            </Avatar>
                            <Chip
                              label={difficultyConfig.label}
                              color={difficultyConfig.color}
                              size="small"
                            />
                          </Box>

                          <Typography variant="h6" gutterBottom>
                            {challenge.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, lineHeight: 1.6 }}
                          >
                            {challenge.description}
                          </Typography>

                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Time progress
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {progressPercent}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progressPercent}
                              sx={{ borderRadius: 4, height: 6 }}
                            />
                          </Box>

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
                                  {challenge.participants.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {challenge.duration} days
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              variant={challenge.isActive ? 'outlined' : 'contained'}
                              size="small"
                              onClick={() => joinMutation.mutate(challenge.id)}
                              disabled={challenge.isActive || joinMutation.isPending}
                            >
                              {challenge.isActive ? '✓ Joined' : 'Join'}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
          </Grid>
        </>
      )}

      {pastChallenges.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            Completed
          </Typography>
          <Grid container spacing={2}>
            {pastChallenges.map((challenge) => (
              <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <Card sx={{ opacity: 0.75 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontSize: '1.4rem' }}>
                        {challenge.badge}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {challenge.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(challenge.startDate)} – {formatDate(challenge.endDate)} ·{' '}
                          {challenge.participants.toLocaleString()} joined
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default ChallengesPage;
