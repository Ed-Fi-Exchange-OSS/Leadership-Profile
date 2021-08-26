export const INITIAL_FILTERS_STATE = {
    nameSearch: '',
    institutions: [],
    positions: [],
    degrees: [],
    tenure: [],
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
    Degree: "DEGREE"
}

export default PillType;