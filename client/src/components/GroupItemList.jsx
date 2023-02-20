import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import GroupItem from './GroupItem';
import CreateGroup from './CreateGroup';

export default function GroupItemList({
  groups,
  isSubmitting,
  error,
  onCreatePrivateGroup,
  onCreatePublicGroup,
  groupId,
  notifications,
}) {
  const [isPublic, setIsPublic] = useState(true);
  const allTags = React.useMemo(() => {
    const set = new Set();
    for (const e of groups) {
      if (e.type !== 'public') continue;
      for (const i of e.tags) {
        set.add(i);
      }
    }
    return set;
  });
  const [tags, setTags] = useState(new Set(Array.from(allTags)));
  const [create, setCreate] = React.useState(false);
  const memo = {};
  for (const e of notifications) {
    if (e.type === 'groupMessage' && e.read === false) {
      memo[e.group] = memo[e.group] + 1 || 1;
    }
  }
  const onClose = () => {
    setCreate(false);
  };
  const onOpen = () => {
    setCreate(true);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const onPublic = () => {
    setIsPublic(true);
  };
  const onPrivate = () => {
    setIsPublic(false);
  };
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    setTags(allTags);
  }, [groups]);

  const filterButton = React.useMemo(
    () => (
      <Button
        sx={{ position: 'absolute', right: 0, color: 'inherit' }}
        onClick={handleClick}
      >
        <FilterListIcon />
      </Button>
    ),
    [handleClick],
  );

  const children = React.useMemo(
    () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
        {Array.from(allTags).map((v, i) => (
          <FormControlLabel
            label={v}
            key={i}
            control={(
              <Checkbox
                checked={tags.has(v)}
                onChange={() => {
                  if (tags.has(v)) {
                    tags.delete(v);
                    setTags(new Set(tags));
                  } else {
                    tags.add(v);
                    setTags(new Set(tags));
                  }
                }}
              />
            )}
          />
        ))}
      </Box>
    ),
    [tags],
  );

  const filter = (
    <div>
      <FormControlLabel
        label="All"
        control={(
          <Checkbox
            checked={tags.size === allTags.size}
            indeterminate={tags.size >= 1 && tags.size < allTags.size}
            onChange={(e) => {
              if (!e.target.checked) {
                setTags(new Set());
              } else {
                setTags(new Set(allTags));
              }
            }}
          />
        )}
      />
      {children}
    </div>
  );

  const popover = (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      {filter}
    </Popover>
  );

  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '2rem',
          padding: '2rem',
          height: '70vh',
          position: 'relative',
        }}
      >
        {isPublic && filterButton}
        {popover}
        <Box sx={{ marginBottom: 1 }}>
          <Button
            variant="filled"
            sx={{ bgcolor: isPublic && 'action.selected' }}
            onClick={onPublic}
          >
            Public
          </Button>
          <Button
            variant="filled"
            sx={{ bgcolor: !isPublic && 'action.selected' }}
            onClick={onPrivate}
          >
            Private
          </Button>
        </Box>
        {isPublic
          && groups.map((v) => {
            if (v.type !== 'public') return null;
            let hasTag = false;
            for (const e of v.tags) {
              if (tags.has(e)) {
                hasTag = true;
                break;
              }
            }
            if (hasTag || v.tags.length === 0) {
              return (
                <GroupItem
                  groupId={v.id}
                  name={v.name}
                  avatar={v.avatar}
                  tags={v.tags}
                  key={v.id}
                  notifications={memo[v.id] || 0}
                  active={v.id === groupId}
                />
              );
            }
            return null;
          })}
        {!isPublic
          && groups.map((v) => {
            if (v.type !== 'private') return null;
            return (
              <GroupItem
                groupId={v.id}
                name={v.name}
                avatar={v.avatar}
                tags={v.tags}
                key={v.id}
                notifications={memo[v.id] || 0}
                active={v.id === groupId}
              />
            );
          })}
      </Box>
      <Box sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}>
        {isPublic ? (
          <Box>
            <Button
              color="inherit"
              sx={{
                bgcolor: 'info.dark',
                '&:hover': {
                  bgcolor: 'info.light',
                },
              }}
              onClick={onOpen}
            >
              Create Public Group
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              color="inherit"
              sx={{
                bgcolor: 'info.dark',
                '&:hover': {
                  bgcolor: 'info.light',
                },
              }}
              onClick={onOpen}
            >
              Create Private Group
            </Button>
          </Box>
        )}
      </Box>
      {create && (
        <CreateGroup
          open={create}
          isPublic={isPublic}
          onClose={onClose}
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={isPublic ? onCreatePublicGroup : onCreatePrivateGroup}
        />
      )}
    </React.Fragment>
  );
}

GroupItemList.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  isSubmitting: PropTypes.bool,
  error: PropTypes.bool,
  onCreatePublicGroup: PropTypes.func,
  onCreatePrivateGroup: PropTypes.func,
  groupId: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
};

GroupItemList.defaultProps = {
  groups: [],
  isSubmitting: false,
  error: false,
  onCreatePrivateGroup: () => {},
  onCreatePublicGroup: () => {},
  groupId: '',
  notifications: [],
};
