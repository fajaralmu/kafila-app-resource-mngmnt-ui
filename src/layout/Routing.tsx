import { resolve } from 'inversify-react';
import React, { Component, Fragment } from 'react'
import {  Navigate, Route, Routes } from 'react-router-dom'; 
import BaseProps from '../models/BaseProps';
import MainAdminPage from '../pages/admin/MainAdminPage';
import UsersPage from '../pages/admin/UsersPage';
import LoginPage from '../pages/auth/LoginPage';
import { ErrorView } from '../pages/error/ErrorView';
import Home from '../pages/home/Home';
import AuthService from './../services/AuthService';
export class Routing extends Component<BaseProps, any>
{
    @resolve(AuthService)
    private authService:AuthService;

    render(): React.ReactNode {
        return (
            <Fragment> 
                
                <Routes>
                    <Route path="/" element={ <Home/> } />
                    <Route path="/home" element={ <Home/> } /> 
                    
                    <Route path="/login" element={ <LoginPage/> } /> 

                    <Route path="/admin" element={
                        this.authService.isAdmin ? <MainAdminPage/> : <Navigate to="/" />
                     }/> 
                    <Route path="/admin/users" element={
                        this.authService.isAdmin ?<UsersPage/> : <Navigate to="/" />
                     } /> 
                    
                    <Route path="*" element={ <ErrorView    message="The requested page is not found." /> } />
                </Routes>
            </Fragment>
        )
    }
}