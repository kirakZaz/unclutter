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
  Divider,
  IconButton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BoltIcon from '@mui/icons-material/Bolt';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCommunities,
  joinCommunity,
  getCommunityPosts,
  likeCommunityPost,
} from '@/services/localDbService';

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

const ALL_CATEGORIES = ['all', 'local', 'repair', 'lifestyle', 'fashion', 'food', 'general'];

function CommunitiesPage() {
  const queryClient = useQueryClient();
  const [joinedIds, setJoinedIds] = React.useState<Set<string>>(new Set());
  const [likedPostIds, setLikedPostIds] = React.useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const { data: communities = [], isLoading: communitiesLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: getCommunities,
  });

  const { data: communityPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => getCommunityPosts(),
  });

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: (_, communityId) => {
      setJoinedIds((prev) => new Set(prev).add(communityId));
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: likeCommunityPost,
    onSuccess: (_, postId) => {
      setLikedPostIds((prev) => new Set(prev).add(postId));
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });

  const filteredCommunities =
    activeCategory === 'all'
      ? communities
      : communities.filter((c) => c.category === activeCategory);

  const featuredCommunity = [...communities].sort((a, b) => b.members - a.members)[0];

  const totalMembers = communities.reduce((sum, c) => sum + c.members, 0);

  return (
    <Box>
      {/* Hero banner */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          mb: 3,
          background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: -60,
            bottom: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            right: -40,
            top: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.07)',
          },
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
          Find Your People
        </Typography>
        <Typography sx={{ opacity: 0.9, mb: 3, maxWidth: 520 }}>
          Join communities of people who share your values — whether that's zero waste, repair,
          slow fashion, or just living with less.
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              {totalMembers.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              total members
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              {communities.length}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              active communities
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              {communityPosts.length}+
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              posts this week
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left column: communities list */}
        <Grid item xs={12} md={8}>
          {/* Category filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const color = cat === 'all' ? '#2D6A4F' : (CATEGORY_COLORS[cat] ?? '#2D6A4F');
              return (
                <Chip
                  key={cat}
                  label={
                    cat === 'all'
                      ? '✦ All'
                      : `${CATEGORY_EMOJIS[cat] ?? ''} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`
                  }
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: isActive ? 700 : 400,
                    bgcolor: isActive ? color : `${color}14`,
                    color: isActive ? 'white' : color,
                    border: '1px solid',
                    borderColor: isActive ? color : `${color}30`,
                    '&:hover': {
                      bgcolor: isActive ? color : `${color}24`,
                    },
                  }}
                />
              );
            })}
          </Box>

          {/* Featured community */}
          {!communitiesLoading && featuredCommunity && activeCategory === 'all' && (
            <Card
              sx={{
                mb: 3,
                border: '2px solid',
                borderColor: 'primary.main',
                background: 'linear-gradient(135deg, rgba(45,106,79,0.04) 0%, rgba(82,183,136,0.06) 100%)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <BoltIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                  <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Most active community
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${CATEGORY_COLORS[featuredCommunity.category] ?? '#2D6A4F'}20`,
                      color: CATEGORY_COLORS[featuredCommunity.category] ?? '#2D6A4F',
                      width: 56,
                      height: 56,
                      fontSize: '1.6rem',
                      flexShrink: 0,
                    }}
                  >
                    {CATEGORY_EMOJIS[featuredCommunity.category] ?? '💬'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {featuredCommunity.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      {featuredCommunity.description}
                    </Typography>
                    {featuredCommunity.recentActivity && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(45,106,79,0.08)',
                          mb: 1.5,
                        }}
                      >
                        <BoltIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                        <Typography variant="caption" color="primary.main" fontWeight={600}>
                          {featuredCommunity.recentActivity}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {featuredCommunity.members.toLocaleString()} members
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {featuredCommunity.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        variant={joinedIds.has(featuredCommunity.id) ? 'outlined' : 'contained'}
                        color="primary"
                        onClick={() => joinMutation.mutate(featuredCommunity.id)}
                        disabled={joinedIds.has(featuredCommunity.id) || joinMutation.isPending}
                      >
                        {joinedIds.has(featuredCommunity.id) ? 'Joined' : 'Join community'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Community grid */}
          <Grid container spacing={2}>
            {communitiesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Grid item xs={12} sm={6} key={i}>
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
              : filteredCommunities
                  .filter((c) => activeCategory !== 'all' || c.id !== featuredCommunity?.id)
                  .map((community) => {
                    const isJoined = joinedIds.has(community.id);
                    const categoryColor = CATEGORY_COLORS[community.category] ?? '#9E7AB3';
                    const categoryEmoji = CATEGORY_EMOJIS[community.category] ?? '💬';

                    return (
                      <Grid item xs={12} sm={6} key={community.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                            },
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                              <Avatar
                                sx={{
                                  bgcolor: `${categoryColor}18`,
                                  color: categoryColor,
                                  width: 44,
                                  height: 44,
                                  fontSize: '1.3rem',
                                  flexShrink: 0,
                                }}
                              >
                                {categoryEmoji}
                              </Avatar>
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ lineHeight: 1.3, mb: 0.3 }}>
                                  {community.name}
                                </Typography>
                                <Chip
                                  label={community.category}
                                  size="small"
                                  sx={{
                                    bgcolor: `${categoryColor}18`,
                                    color: categoryColor,
                                    fontWeight: 600,
                                    fontSize: '0.65rem',
                                    height: 18,
                                  }}
                                />
                              </Box>
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 1.5,
                                lineHeight: 1.6,
                              }}
                            >
                              {community.description}
                            </Typography>

                            {community.recentActivity && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  mb: 1.5,
                                  px: 1,
                                  py: 0.4,
                                  borderRadius: 1.5,
                                  bgcolor: `${categoryColor}10`,
                                }}
                              >
                                <BoltIcon sx={{ fontSize: 11, color: categoryColor }} />
                                <Typography variant="caption" sx={{ color: categoryColor, fontWeight: 500 }} noWrap>
                                  {community.recentActivity}
                                </Typography>
                              </Box>
                            )}

                            <Divider sx={{ mb: 1.5 }} />

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PeopleIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {community.members.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <LocationOnIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary" noWrap>
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
                                sx={{ minWidth: 60 }}
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
        </Grid>

        {/* Right column: activity feed */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 16 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Community feed
              </Typography>

              {postsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="80%" />
                  </Box>
                ))
              ) : communityPosts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No community posts yet.
                </Typography>
              ) : (
                communityPosts.map((post, index) => {
                  const isLiked = likedPostIds.has(post.id);
                  return (
                    <Box key={post.id}>
                      <Box sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
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
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="caption" fontWeight={600} display="block" noWrap>
                              {post.authorName}
                            </Typography>
                            <Chip
                              label={post.communityName}
                              size="small"
                              sx={{
                                fontSize: '0.58rem',
                                height: 16,
                                bgcolor: 'rgba(45,106,79,0.08)',
                                color: 'primary.main',
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6, mb: 0.8 }}
                        >
                          {post.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => !isLiked && likeMutation.mutate(post.id)}
                            disabled={isLiked || likeMutation.isPending}
                            sx={{ p: 0.4 }}
                          >
                            {isLiked ? (
                              <FavoriteIcon sx={{ fontSize: 14, color: '#C44B4B' }} />
                            ) : (
                              <FavoriteBorderIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            )}
                          </IconButton>
                          <Typography variant="caption" color="text.disabled">
                            {post.likes + (isLiked ? 1 : 0)}
                          </Typography>
                        </Box>
                      </Box>
                      {index < communityPosts.length - 1 && <Divider />}
                    </Box>
                  );
                })
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CommunitiesPage;
