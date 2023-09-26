// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import PropTypes from 'prop-types';

const Filtering = (props) => {
}

Filtering.defaultProps = {
    status: 'asc',
    onSortChange: null,
    children: null,
};

Filtering.propTypes = {
    status: PropTypes.string,
    onSortChange: PropTypes.func,
    children: PropTypes.element,
};

export default Filtering;
