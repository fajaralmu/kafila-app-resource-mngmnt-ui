import { resolve } from 'inversify-react';
import React, { Component, Fragment } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import BaseProps from '../models/BaseProps';
import EmployeesPage from '../pages/admin/masterData/EmployeesPage';
import MainAdminPage from '../pages/admin/MainAdminPage';
import SchoolsPage from '../pages/admin/masterData/SchoolsPage';
import UsersPage from '../pages/admin/masterData/UsersPage';
import LoginPage from '../pages/auth/LoginPage';
import { ErrorView } from '../pages/error/ErrorView';
import Home from '../pages/home/Home';
import Dashboard from '../pages/user/Dashboard';
import EditProfile from '../pages/user/EditProfile';
import AuthService from './../services/AuthService';
import RoutingService from './../services/RoutingService';
import AuthorityType from './../constants/AuthorityType';
import SemesterPeriodsPage from '../pages/admin/masterData/SemesterPeriodsPage';
import ClassLevelsPage from '../pages/admin/masterData/ClassLevelsPage';
import StudentsPage from '../pages/admin/masterData/StudentsPage';
import ClassMembersPage from '../pages/admin/masterData/ClassMembersPage';
import BulkInsertView from './../pages/admin/bulkInsert/BulkInsertView';
import ClassLevelsPageV2 from '../pages/admin/masterData/v2/ClassLevelsPageV2';

export class Routing extends Component<BaseProps, any> {
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
            <RestrictedRouteElement disabledWhenLoggedIn={true} to="/login" element={<LoginPage />} />
          } />

          <Route path="/dashboard" element={
            <RestrictedRouteElement to="/dashboard" element={<Dashboard />} />
          } />
          <Route path="/profile" element={
            <RestrictedRouteElement to='/profile' element={<EditProfile />} />
          } />

          <Route path="/admin" element={
            <RestrictedRouteElement to="/admin" element={<MainAdminPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/users" element={
            <RestrictedRouteElement to="/admin/users" element={<UsersPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/schools" element={
            <RestrictedRouteElement to="/admin/schools" element={<SchoolsPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/employees" element={
            <RestrictedRouteElement to="/admin/employees" element={<EmployeesPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/semesterperiods" element={
            <RestrictedRouteElement to="/admin/semesterperiods" element={<SemesterPeriodsPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/classlevels" element={
            <RestrictedRouteElement to="/admin/classlevels" element={<ClassLevelsPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/v2/classlevels" element={
            <RestrictedRouteElement to="/admin/classlevelsv2" element={<ClassLevelsPageV2 />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/students" element={
            <RestrictedRouteElement to="/admin/students" element={<StudentsPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/classmembers" element={
            <RestrictedRouteElement to="/admin/classmembers" element={<ClassMembersPage />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="/admin/bulkinsert" element={
            <RestrictedRouteElement to="/admin/bulkinsert" element={<BulkInsertView />} requiredRole={'ROLE_SUPERADMIN'} />
          } />
          <Route path="*" element={<ErrorView message="The requested page is not found." />} />
        </Routes>
      </Fragment>
    )
  }
}

class RestrictedRouteElement extends Component<{
  to: string,
  element: JSX.Element,
  disabledWhenLoggedIn?: boolean,
  requiredRole?: AuthorityType | AuthorityType[]
}, any> {

  @resolve(AuthService)
  private authService: AuthService;
  @resolve(RoutingService)
  private routingService: RoutingService;

  render(): React.ReactNode {
    const loggedIn = this.authService.loggedIn;

    if (this.props.disabledWhenLoggedIn === true) {
      if (!loggedIn) {
        return this.props.element;
      }
      return (
        <Navigate to="/dashboard" />
      )
    }

    if (loggedIn) {
      if (this.props.requiredRole) {
        if (this.authService.loggedUser?.hasAuthorityType(this.props.requiredRole)) {
          return this.props.element;
        } else {
          return <Navigate to="/" />
        }
      } else {
        return this.props.element;
      }
    }
    return (
      <CustomNavigate origin={this.props.to} routing={this.routingService} to="/" />
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
  return <Navigate to={props.to} state={props.state} replace={props.replace} />
}