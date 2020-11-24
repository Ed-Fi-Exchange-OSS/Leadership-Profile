import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';

function UseDirectoryFilters() {
    const [search, setSearch] = searchableUrl.searchParams.get('search') !== null && searchableUrl.searchParams.get('search') !== 'null' ? searchableUrl.searchParams.get('search') : null;

}

export default UseDirectoryFilters;