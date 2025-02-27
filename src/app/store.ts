import { configureStore } from '@reduxjs/toolkit';

import mobReducer from '../features/mob/mob-slice';
import monsterReducer from '../features/monster/monster-slice';

export const store = configureStore({
    reducer: {
        monster: monsterReducer,
        mob: mobReducer
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;