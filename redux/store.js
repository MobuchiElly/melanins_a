import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice';
import postsReducer from './posts/postsSlice';
import routeReducer from './loadingState/routeloading';

const store = configureStore({
    reducer:{
        user: userReducer,
        posts: postsReducer,
        routes: routeReducer
    }
});

export default store;