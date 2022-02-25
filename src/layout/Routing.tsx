import { resolve } from 'inversify-react';
import React, { Component, Fragment } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import BaseProps from '../models/BaseProps';
import EmployeesPage from '../pages/admin/EmployeesPage';
import MainAdminPage from '../pages/admin/MainAdminPage';
import SchoolsPage from '../pages/admin/SchoolsPage';
import UsersPage from '../pages/admin/UsersPage';
import LoginPage from '../pages/auth/LoginPage';
import { ErrorView } from '../pages/error/ErrorView';
import Home from '../pages/home/Home';
import AuthService from './../services/AuthService';
import RoutingService from './../services/RoutingService';

export class Routing extends Component<BaseProps, any>
{
    @resolve(AuthService)
    private authService: AuthService;
    @resolve(RoutingService)
    private routingService: RoutingService;

    render(): React.ReactNode {
        return (
            <Fragment>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />

                    <Route path="/login" element={
                        this.authService.loggedIn == false ? <LoginPage /> : <Navigate to="/" />
                    } />

                    <Route path="/admin" element={
                        this.authService.isAdmin ? 
                        <MainAdminPage /> 
                        : <CustomNavigate origin='/admin' routing={this.routingService} to="/" />
                    } />
                    <Route path="/admin/users" element={
                        this.authService.isAdmin ? 
                        <UsersPage /> 
                        : <CustomNavigate origin="/admin/users" routing={this.routingService} to="/" />
                    } />
                    <Route path="/admin/schools" element={
                        this.authService.isAdmin ? 
                        <SchoolsPage /> 
                        : <CustomNavigate origin="/admin/schools" routing={this.routingService} to="/" />
                    } />
                    <Route path="/admin/employees" element={
                        this.authService.isAdmin ? 
                        <EmployeesPage /> 
                        : <CustomNavigate origin="/admin/employees" routing={this.routingService} to="/" />
                    } />

                    <Route path="*" element={<ErrorView message="The requested page is not found." />} />
                </Routes>
            </Fragment>
        )
    }
}
interface NavigateProps {
    origin: string,
    to: string,
    state?: any,
    replace?: any,
    routing: RoutingService
}
const CustomNavigate = (props: NavigateProps) => {
    props.routing.setLastRedirectedRoute(props.origin);
    return <Navigate to = { props.to } state = { props.state } replace = { props.replace } />
}