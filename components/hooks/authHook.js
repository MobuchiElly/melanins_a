import {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUser } from '@/redux/user/userSlice';

const useAuthHook = () => {
    const userCookie = Cookies.get("user");
    const userState = userCookie ? JSON.parse(userCookie) : null;
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
    userState && JSON.stringify(userState) !== JSON.stringify(user) ? dispatch(setUser(userState)) : null;
    }, [dispatch, user, userState])
    
     console.log("user status(authhook):", user)
    const isAuthenticated = !!user;
    const admin = user && user.status === "admin";
    return { user, isAuthenticated, admin, dispatch };
}

export default useAuthHook;