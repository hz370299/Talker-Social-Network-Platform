import GroupsIcon from '@mui/icons-material/Groups';
import { Button, Divider, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ButtonList from '../components/ButtonList';
import GroupItemList from '../components/GroupItemList';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import {
  createPrivateGroup,
  createPublicGroup,
  fetchGroups,
} from '../redux/groups';
import { GlassBox } from './Home';
import Tag from '../components/Tag';

export default function GroupPage() {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
    dispatch(fetchGroups());
  }, []);

  const onCreatePublicGroup = (formData) => {
    dispatch(createPublicGroup(formData));
  };

  const onCreatePrivateGroup = (formData) => {
    dispatch(createPrivateGroup(formData));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={2}
        sx={{
          paddingLeft: '2rem',
          paddingTop: '2rem',
          minWidth: '400px',
          paddingBottom: '6rem',
        }}
      >
        <Grid item xs={12} md={3} style={{ margingleft: '1.5rem' }}>
          <Box
            sx={{
              position: 'sticky',
              top: '50px',
              maxWidth: '350px',
              marginInline: 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', paddingBottom: '0.8rem' }}
            >
              Groups
            </Typography>
            {group.isLoading.groups ? (
              <FriendSkeleton />
            ) : (
              <GroupItemList
                groups={group.groups}
                isSubmitting={group.isSubmitting}
                error={group.error.create}
                onCreatePublicGroup={onCreatePublicGroup}
                onCreatePrivateGroup={onCreatePrivateGroup}
                notifications={user.notifications}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
            <Divider sx={{ mt: 6 }} />
            <Box sx={{ textAlign: 'center', pt: 10 }}>
              <GroupsIcon
                sx={{
                  width: '80px',
                  height: '80px',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                color="info"
              />
              <Typography variant="h5">Your Groups</Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Send private photos and messages to a friend or group.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              position: 'sticky',
              top: '50px',
              maxWidth: '350px',
              marginInline: 'auto',
            }}
          >
            <ButtonList current="group" />
            <GlassBox sx={{ mt: 10 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                Recommended Groups
              </Typography>
              {group.isLoading.groups
                ? [...Array(3)].map((v, i) => <FriendSkeleton key={i} />)
                : group.recommendedGroups.map((v) => (
                  <Box
                    sx={{
                      marginBottom: '1.5rem',
                      display: 'flex',
                    }}
                    key={v.id}
                  >
                    <Box>
                      <Button>
                        <Link to={`/search/group/profile/${v.id}`}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            color="primary"
                          >
                            <Avatar
                              alt="Travis Howard"
                              src={v.avatar}
                              sx={{ width: 56, height: 56 }}
                            />
                          </Badge>
                        </Link>
                      </Button>
                    </Box>
                    <Box sx={{ marginTop: '0.3rem', flexGrow: 1 }}>
                      <Typography
                        sx={{
                          marginLeft: '1rem',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                        variant="subtitle1"
                      >
                        {v.name}
                      </Typography>
                      <Box
                        sx={{
                          marginLeft: '1rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        {v.tags.map((v, i) => (
                          <Tag name={v} key={i} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))}
            </GlassBox>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
