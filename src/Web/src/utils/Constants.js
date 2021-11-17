export const INITIAL_FILTERS_STATE = {
    nameSearch: '',
    institutions: [],
    positions: [],
    degrees: [],
    schoolCategories: [],
    tenure: [],
    category:'',
    categoryLabel: '',
    score: 0,
    pills: []

    /*
    -- Contains whatever is being typed in name input
    nameSearch: 'test',

    -- Contains array of institution identifiers
    -- ex.
    institutions: [1234, 4567],

    -- Contains array of positions identifiers
    -- ex.
    positions: [10, 11, 14],

    -- Contains array of degrees identifiers
    -- ex.
    degrees: [1, 2, 3],

    tenure: [],

    -- Contains array of pill objects with PillType, name and value
    -- ex.
    pills: [{"POSITION", "Test", 1234}]
    */ 
}

const PillType = {
    Position: "POSITION",
    Institution: "INSTITUTION",
    Tenure: "TENURE",
    Degree: "DEGREE",
    SchoolCategory: "SCHOOL_CATEGORY",
    Rating: "RATING"
}

export default PillType;

export const SCORE_OPTIONS = 
    [
        {"text": "At Least 1", "value": 1, "selected": false},
        {"text": "At Least 2", "value": 2, "selected": false},
        {"text": "At Least 3", "value": 3, "selected": false},
        {"text": "At Least 4", "value": 4, "selected": false},
        {"text": "5", "value": 5, "selected": false}
    ];

export const TENURE_RANGES = {
    0: {min:0, max:2},
    1: {min:3, max:5},
    2: {min:6, max:10},
    3: {min:11, max:15},
    4: {min:15, max:100}
}
