import React, { Component } from 'react';

class TableViewIcon extends Component {
    render() {
        return (
            <svg width="12px" height="12px" viewBox="0 0 16 16" className="bi bi-card-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M14.5 3h-13a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                <path fill-rule="evenodd" d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z" />
                <circle cx="3.5" cy="5.5" r=".5" />
                <circle cx="3.5" cy="8" r=".5" />
                <circle cx="3.5" cy="10.5" r=".5" />
            </svg>
        )
    }
}

class CardViewIcon extends Component {
    render() {
        return (

            <svg width="12px" height="12px" viewBox="0 0 16 16" className="bi bi-grid-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
            </svg>
        )
    }
}

class FilterIcon extends Component {
    render() {
        return (
            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" fill="solid" xmlns="http://www.w3.org/2000/svg">
                <title>402B5C56-C715-4CE9-B8C9-4B3F6DF96D9A</title>
                <defs>
                    <path d="M10.877,17.457 L12.903,18.99 L12.903,14.437 C12.903,14.271 12.945,14.108 13.023,13.962 L17.323,6 L6.643,6 L10.765,13.978 C10.839,14.12 10.877,14.278 10.877,14.437 L10.877,17.457 Z M13.903,22 C13.69,22 13.477,21.932 13.3,21.797 L9.274,18.752 C9.024,18.563 8.877,18.268 8.877,17.955 L8.877,14.681 L4.112,5.459 C3.951,5.149 3.964,4.778 4.146,4.48 C4.327,4.182 4.651,4 5,4 L19,4 C19.352,4 19.678,4.185 19.859,4.488 C20.039,4.79 20.047,5.165 19.88,5.475 L14.903,14.69 L14.903,21 C14.903,21.379 14.689,21.726 14.349,21.895 C14.208,21.965 14.055,22 13.903,22 L13.903,22 Z" id="path-1"></path>
                </defs>
                <g id="⭐️-[Symbols]-Icons" stroke-width="1" fill="solid" fill-color="#3366FF">
                    <g id="27)-Icon/funnel">
                        <mask id="mask-2" >
                            <use xlink href="#path-1"></use>
                        </mask>
                        <use id="🎨-Icon-Сolor" fill="#3366FF" href="#path-1"></use>
                    </g>
                </g>
            </svg >
        );
    }
}

const SortIcon = () =>
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-filter" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
    </svg>;

const SearchIcon = ({ stylingId }) =>
    <svg id={stylingId} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />
        <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
    </svg>;

class MailIcon extends Component {
    render() {
        return (
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-envelope-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
            </svg>
        );
    }
}

class PhoneIcon extends Component {
    render() {
        return (
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-telephone-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.267.98a1.636 1.636 0 0 1 2.448.152l1.681 2.162c.309.396.418.913.296 1.4l-.513 2.053a.636.636 0 0 0 .167.604L8.65 9.654a.636.636 0 0 0 .604.167l2.052-.513a1.636 1.636 0 0 1 1.401.296l2.162 1.681c.777.604.849 1.753.153 2.448l-.97.97c-.693.693-1.73.998-2.697.658a17.47 17.47 0 0 1-6.571-4.144A17.47 17.47 0 0 1 .639 4.646c-.34-.967-.035-2.004.658-2.698l.97-.969z" />
            </svg>
        );
    }
}

class PersonIcon extends Component {
    render() {
        return (
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
        );
    }
}

class GeoIcon extends Component {
    render() {
        return (
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-geo-alt-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
        );
    }
}

class RightPointingIcon extends Component {
    render() {
        return (
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-caret-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M6 12.796L11.481 8 6 3.204v9.592zm.659.753l5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
            </svg>
        );
    }
}

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
    RightPointingIcon
};