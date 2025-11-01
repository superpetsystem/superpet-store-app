import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SystemUser, Role, AuditLog, UsersState } from '../../types';

const initialState: UsersState = {
  users: [],
  roles: [],
  auditLogs: [],
  selectedUser: null,
  selectedRole: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUsers: (state, action: PayloadAction<SystemUser[]>) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    setAuditLogs: (state, action: PayloadAction<AuditLog[]>) => {
      state.auditLogs = action.payload;
    },
    addUser: (state, action: PayloadAction<SystemUser>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<SystemUser>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },
    selectUser: (state, action: PayloadAction<SystemUser | null>) => {
      state.selectedUser = action.payload;
    },
    selectRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setUsers,
  setRoles,
  setAuditLogs,
  addUser,
  updateUser,
  deleteUser,
  selectUser,
  selectRole,
} = usersSlice.actions;

export default usersSlice.reducer;

