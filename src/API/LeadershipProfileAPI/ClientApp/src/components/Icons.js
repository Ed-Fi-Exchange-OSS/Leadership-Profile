import React from 'react';

const TableViewIcon = () => 
    <img alt="filtering icon" src={process.env.PUBLIC_URL + "/icons/list.svg"} />

const CardViewIcon = () =>
    <img alt="filtering icon" src={process.env.PUBLIC_URL + "/icons/grid.svg"} />

const FilterIcon = () =>
    <img alt="filtering icon" src={process.env.PUBLIC_URL + "/icons/funnel-fill.svg"} />

const SortIcon = () =>
    <img alt="sorting icon" src={process.env.PUBLIC_URL + "/icons/Sort by.svg"} />

const SearchIcon = ({ stylingId }) =>
    <svg id={stylingId} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />
        <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
    </svg>;

const MailIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/envelope.svg"} />

const PhoneIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/phone.svg"} />

const PersonIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/person.svg"} />

const GeoIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/location.svg"} />

const EducationIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/school.svg"} />

const EducationIconNavy = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/school-navy.svg"} />

const CalendarIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/calendar.svg"} />

const IdIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/id.svg"} />

const BriefcaseIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/briefcase.svg"} />

const ChartIcon = (isDark = false) => 
    <img alt="right arrow" src={process.env.PUBLIC_URL + (!!isDark ? "/icons/chart-dark.svg" : "/icons/chart.svg"  )} />

const CertificateIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/certificate.svg"} />

const RibbonIcon = () =>     
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/ribbon.svg"} />

const RightPointingIcon = () =>
    <ion-icon name="chevron-forward-outline"></ion-icon>

const DownPointingIcon = () =>
    <img alt="right arrow" src={process.env.PUBLIC_URL + "/icons/arrow-ios-down.svg"} />

export {
    TableViewIcon,
    CardViewIcon,
    FilterIcon,
    SearchIcon,
    SortIcon,
    MailIcon,
    PhoneIcon,
    PersonIcon,
    GeoIcon,
    EducationIcon,
    EducationIconNavy,
    RibbonIcon,
    CalendarIcon,
    IdIcon,
    BriefcaseIcon,
    ChartIcon,
    CertificateIcon,
    RightPointingIcon,
    DownPointingIcon
};