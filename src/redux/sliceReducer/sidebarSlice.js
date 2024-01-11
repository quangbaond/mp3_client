import { createSlice } from '@reduxjs/toolkit';
import { idActiveSidebar } from '../../config/localStorages';

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        idSidebarActive: idActiveSidebar || 1,
        isWithDraw: false,
    },
    reducers: {
        setIdSidebarActive: (state, action) => {
            state.idSidebarActive = action.payload;
        },

        setWithDraw: (state, action) => {
            state.isWithDraw = action.payload;
        }
    },
});
