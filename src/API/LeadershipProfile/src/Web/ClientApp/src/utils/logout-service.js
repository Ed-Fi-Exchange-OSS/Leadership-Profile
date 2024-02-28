// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import AuthService from '../utils/auth-service';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function LogoutService() {
    const navigate = useNavigate();
    const { logoutAuth, getAuthInfo } = AuthService();
    const authInfo = getAuthInfo();
    const { API_URL } = config();

    function logout() {
        const apiUrl = new URL(API_URL + '/logout');
        fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            referrerPolicy: 'origin-when-cross-origin',
            body: JSON.stringify({
            'logoutId': authInfo,
        })}).then(() => {
          logoutAuth();
          navigate('/');
        }).catch(error => console.error(error));
      }

      return { logout }
}

export default LogoutService;

