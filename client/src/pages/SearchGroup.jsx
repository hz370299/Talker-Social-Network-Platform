import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Button, Divider, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Tag from '../components/Tag';
import { requestToJoinGroup } from '../redux/groups';
import { searchGroupById } from '../redux/search';
import PostSkeleton from '../skeletons/PostSkeleton';

export default function SearchGroup() {
  const { id: groupId } = useParams();
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const user = useSelector((state) => state.user);
  const [sentRequest, setSentRequest] = React.useState(false);
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);
  useEffect(() => {
    dispatch(searchGroupById(groupId));
  }, [groupId]);

  const onJoin = () => {
    dispatch(requestToJoinGroup(groupId));
    setSentRequest(true);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{
          paddingTop: '2rem',
          minWidth: '400px',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
            <Divider sx={{ mt: 6 }} />
            {search.isLoading ? (
              <PostSkeleton />
            ) : (
              <Card
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  pb: 2,
                  borderRadius: 2,
                }}
              >
                <CardHeader
                  avatar={(
                    <Avatar
                      src={search.group.avatar}
                      aria-label="Group Avatar"
                    />
                  )}
                  title={search.group.name}
                  subheader={`${
                    search.group.administrators.length
                    + search.group.members.length
                    + 1
                  } members`}
                />
                <Divider />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
                      Creator
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        bgcolor: 'action.selected',
                        borderRadius: 2,
                        pb: 3,
                        pl: 2,
                        pt: 2,
                        pr: 2,
                      }}
                    >
                      <Box
                        sx={{
                          mr: 1,
                          textAlign: 'center',
                        }}
                      >
                        <Button
                          id={
                            (search.group.creator && search.group.creator.id)
                            || ''
                          }
                        >
                          <Avatar
                            src={
                              (search.group.creator
                                && search.group.creator.avatar)
                              || ''
                            }
                            sx={{
                              width: '48px',
                              height: '48px',
                            }}
                          />
                        </Button>
                        <Typography
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'text.secondary',
                          }}
                          variant="subtitle2"
                        >
                          {(search.group.creator
                            && search.group.creator.name)
                            || ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
                      Admins
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        bgcolor: 'action.selected',
                        borderRadius: 2,
                        pb: 3,
                        pl: 2,
                        pt: 2,
                        pr: 2,
                      }}
                    >
                      {search.group.administrators.map((v) => (
                        <Box
                          sx={{
                            mr: 1,
                            textAlign: 'center',
                          }}
                          key={v.id}
                        >
                          <Button id={v.id}>
                            <Avatar
                              src={v.avatar}
                              sx={{
                                width: '48px',
                                height: '48px',
                              }}
                            />
                          </Button>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'text.secondary',
                            }}
                            variant="subtitle2"
                          >
                            {v.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
                      Members
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        bgcolor: 'action.selected',
                        borderRadius: 2,
                        pb: 3,
                        pl: 2,
                        pt: 2,
                        pr: 2,
                      }}
                    >
                      {search.group.members.map((v) => (
                        <Box
                          sx={{
                            mr: 1,
                            textAlign: 'center',
                          }}
                          key={v.id}
                        >
                          <Button id={v.id}>
                            <Avatar
                              src={v.avatar}
                              sx={{
                                width: '48px',
                                height: '48px',
                              }}
                            />
                          </Button>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'text.secondary',
                            }}
                            variant="subtitle2"
                          >
                            {v.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {search.group.tags.map((v, i) => (
                        <Tag name={v} key={i} />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
                      Group Info
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        bgcolor: 'action.selected',
                        borderRadius: 2,
                        pb: 3,
                        pl: 2,
                        pt: 2,
                        pr: 2,
                      }}
                    >
                      <Typography>{search.group.bio}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {search.group.creator === user.id
                    || search.group.administrators.findIndex(
                      (v) => v.id === user.id,
                    ) >= 0
                    || search.group.members.findIndex((v) => v.id === user.id)
                      >= 0 ? (
                        <Button
                          endIcon={<CheckBoxIcon />}
                          color="inherit"
                          disabled
                          sx={{ mt: 5, bgcolor: 'success.main', width: '60%' }}
                        >
                          Joined
                        </Button>
                      ) : sentRequest ? (
                        <Button
                          endIcon={<CheckBoxIcon />}
                          color="inherit"
                          disabled
                          sx={{ mt: 5, bgcolor: 'success.main', width: '60%' }}
                        >
                          Sent
                        </Button>
                      ) : (
                        <Button
                          sx={{
                            float: 'right',
                            mt: 5,
                            color: 'inherit',
                            bgcolor: 'success.main',
                            width: '60%',
                          }}
                          onClick={onJoin}
                        >
                          Join
                        </Button>
                      )}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
