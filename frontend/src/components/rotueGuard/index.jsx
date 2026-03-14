import { Fragment } from 'react';
import {Navigate, Route, useLocation, Outlet} from 'react-router-dom';

function RouteGuard({authenticated, user, element}){
    const location = useLocation();

    if(!authenticated && !location.pathname.includes('/auth')){
        return <Navigate to='/auth/register'></Navigate>
    }
    if(authenticated && user?.role !== 'instructor' && (location.pathname.includes('/instructor') || location.pathname.includes('/auth'))){
        return <Navigate to='/' replace></Navigate>
    }
    if(authenticated && user?.role === 'instructor' && (!location.pathname.includes('/instructor') || location.pathname.includes('/auth'))){
        return <Navigate to='/instructor/dashboard'/>
    }
    return <Outlet />;
} 

export default RouteGuard;