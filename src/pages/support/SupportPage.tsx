import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupportPosts, addSupportPost, likeSupportPost } from '@/services/localDbService';
import { useAuth } from '@/hooks/useAuth';
import SectionHeader from '@/components/common/SectionHeader';

function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function SupportPage() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [likedPostIds, setLikedPostIds] = React.useState<Set<string>>(new Set());

  const [formValues, setFormValues] = React.useState({ title: '', content: '', tagsInput: '' });

  const { data: supportPosts = [], isLoading } = useQuery({
    queryKey: ['supportPosts'],
    queryFn: getSupportPosts,
  });

  const addPostMutation = useMutation({
    mutationFn: addSupportPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportPosts'] });
      setIsDialogOpen(false);
      setFormValues({ title: '', content: '', tagsInput: '' });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: likeSupportPost,
    onSuccess: (_, postId) => {
      setLikedPostIds((prev) => new Set(prev).add(postId));
      queryClient.invalidateQueries({ queryKey: ['supportPosts'] });
    },
  });

  const handleSubmit = () => {
    if (!currentUser) return;
    const tags = formValues.tagsInput
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    addPostMutation.mutate({
      authorId: currentUser.id,
      authorName: currentUser.name,
      title: formValues.title,
      content: formValues.content,
      tags,
    });
  };

  const getAvatarInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <Box>
      <SectionHeader
        title="Support"
        subtitle="Share experiences, ask questions and find motivation from the community"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Start a post
          </Button>
        }
      />

      <Box sx={{ maxWidth: 720 }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="30%" />
                      <Skeleton variant="text" width="20%" />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="70%" />
                </CardContent>
              </Card>
            ))
          : supportPosts.map((post) => {
              const isLiked = likedPostIds.has(post.id);
              return (
                <Card key={post.id} sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Author info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar
                        sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.8rem' }}
                      >
                        {getAvatarInitials(post.authorName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {post.authorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatRelativeTime(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Post content */}
                    <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem' }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                      {post.content}
                    </Typography>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {post.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={`#${tag}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 22 }}
                          />
                        ))}
                      </Box>
                    )}

                    <Divider sx={{ mb: 1.5 }} />

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => !isLiked && likePostMutation.mutate(post.id)}
                        disabled={isLiked}
                        sx={{ gap: 0.5, borderRadius: 2, px: 1.5 }}
                      >
                        {isLiked ? (
                          <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                        )}
                        <Typography variant="caption">{post.likes}</Typography>
                      </IconButton>
                      <IconButton size="small" sx={{ gap: 0.5, borderRadius: 2, px: 1.5 }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
                        <Typography variant="caption">{post.replies} replies</Typography>
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
      </Box>

      {/* Add post dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start a conversation</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}
        >
          <TextField
            label="What's on your mind?"
            name="title"
            value={formValues.title}
            onChange={(event) => setFormValues((prev) => ({ ...prev, title: event.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Share your thoughts or question"
            name="content"
            value={formValues.content}
            onChange={(event) => setFormValues((prev) => ({ ...prev, content: event.target.value }))}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            label="Tags (comma-separated)"
            name="tagsInput"
            value={formValues.tagsInput}
            onChange={(event) => setFormValues((prev) => ({ ...prev, tagsInput: event.target.value }))}
            fullWidth
            helperText="e.g. advice, minimalism, emotional"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formValues.title || !formValues.content || addPostMutation.isPending}
          >
            {addPostMutation.isPending ? 'Posting…' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SupportPage;
