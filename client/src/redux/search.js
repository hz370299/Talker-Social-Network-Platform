import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setCommonError } from './ui';

export const searchUsersAndGroups = createAsyncThunk(
  'search/searchUsersAndGroups',
  async (query, { dispatch, extra }) => {
    try {
      const { url } = extra;
      const { data } = await axios.post(`${url}/api/handle/search`, {
        query,
      });
      dispatch(setCommonError(false));
      dispatch(setResults(data));
    } catch (err) {
      dispatch(setCommonError(true));
    }
  },
);

export const searchGroupById = createAsyncThunk(
  'search/searchgroupbyid',
  async (groupId, { dispatch, extra }) => {
    try {
      dispatch(setIsLoading(true));
      const { url } = extra;
      const response = await axios.get(`${url}/api/group/search/${groupId}`);
      const { data } = response;
      dispatch(setGroup(data));
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log(err);
      dispatch(setIsLoading(false));
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: {
      users: [],
      groups: [],
    },
    isLoading: true,
    group: {},
  },
  reducers: {
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
  },
});

export default searchSlice.reducer;
export const { setResults, setIsLoading, setGroup } = searchSlice.actions;
