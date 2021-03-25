import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import config from '../../../config';

function UseAdvancedSearch(){
    const { API_URL, API_CONFIG } = config();

    const [degrees, setDegrees] = useState({});
    const [assignment, setAssignment] = useState({});
    const [certifications, setCertifications] = useState({});
    const [categories, setCategories] = useState({});

    async function GetDegrees(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/degrees`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                var newResponse = [];
                response.degrees.forEach(element => {
                    newResponse.push({
                        "text": element.text,
                        "value": element.value,
                        "checked": false
                    })
                });
                setDegrees(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    async function GetSpeciaizations(){

        var specializations = {
            "degrees": [
            {
                "text": "AA",
                "value": 4388
            },
            {
                "text": "BA",
                "value": 4389
            },
            {
                "text": "BS",
                "value": 4390
            },
            {
                "text": "MA",
                "value": 4391
            },
            {
                "text": "MA+45",
                "value": 4392
            },
            {
                "text": "None",
                "value": 4393
            },
            {
                "text": "PhD",
                "value": 4394
            },
            {
                "text": "Associates",
                "value": 4395
            },
            {
                "text": "Bachelors",
                "value": 4396
            },
            {
                "text": "Masters",
                "value": 4397
            },
            {
                "text": "Associate's",
                "value": 11769
            },
            {
                "text": "Bachelor's",
                "value": 11770
            },
            {
                "text": "Master's",
                "value": 11771
            }
            ]
        };

        return specializations;
    }

    async function GetPositionHistory(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/assignments`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                var newResponse = [];
                response.assignments.forEach(element => {
                    newResponse.push({
                        "text": element.text,
                        "value": element.value,
                        "checked": false
                    })
                });
                setAssignment(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    async function GetCertifications(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/certifications`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                var newResponse = [];
                response.certifications.forEach(element => {
                    newResponse.push({
                        "text": element.text,
                        "value": element.value,
                        "checked": false
                    })
                });
                setCertifications(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    async function GetCatergories(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/measurementcategories`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {

                var catSubCAtArr = [    
                    {
                        "CategoryId": 767,
                        "Category": "RELATIONSHIP DRIVEN",
                        "SubCategory": "Leading from our values including integrity, gratitude, humility, and kindness"
                    },
                    {
                        "CategoryId": 776,
                        "Category": "TECHNICAL SKILLS",
                        "SubCategory": "Create and enforce consistent school-wide discipline practices to create a safe, inclusive, and learning-focused environment"
                    },
                    {
                        "CategoryId": 766,
                        "Category": "PROMISE 2 PURPOSE INVESTOR",
                        "SubCategory": "Consistently displaying a sense of possibility, optimism, and hope"
                    },
                    {
                        "CategoryId": 772,
                        "Category": "STUDENT FOCUSED",
                        "SubCategory": "Demonstrating a deep understanding of High Quality Teaching"
                    }
                ];

                response.categories = catSubCAtArr;

                var newResponse = [];
                response.categories.forEach(element => {
                    newResponse.push({
                        "text": element.Category,
                        "value": element.CategoryId,
                        "selected": false
                    })
                });
                setCategories(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    function GetSubCategories(categorieId){
        var catSubCAtArr = [    
            {
                "CategoryId": 767,
                "Category": "RELATIONSHIP DRIVEN",
                "SubCategory": "Leading from our values including integrity, gratitude, humility, and kindness"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Create and enforce consistent school-wide discipline practices to create a safe, inclusive, and learning-focused environment"
            },
            {
                "CategoryId": 766,
                "Category": "PROMISE 2 PURPOSE INVESTOR",
                "SubCategory": "Consistently displaying a sense of possibility, optimism, and hope"
            },
            {
                "CategoryId": 772,
                "Category": "STUDENT FOCUSED",
                "SubCategory": "Demonstrating a deep understanding of High Quality Teaching"
            },
            {
                "CategoryId": 767,
                "Category": "RELATIONSHIP DRIVEN",
                "SubCategory": "Establishing a culture of trust, partnership, and collaboration"
            },
            {
                "CategoryId": 755,
                "Category": "FOREVER LEARNER",
                "SubCategory": "Always seeking opportunities to continuously learn and grow"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Enforce state and district policies, and create & implement school-specific procedures as appropriate (e.g., entrance and dismissal procedures, master schedules, cafeteria procedures, transition procedures and protocols) to ensure the safety and success of all students and staff"
            },
            {
                "CategoryId": 767,
                "Category": "RELATIONSHIP DRIVEN",
                "SubCategory": "Always thinking “we” and not “me”"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Act as the school's instructional leader by overseeing student data analysis and PLC's, as well as the assessment process, to drive strong instructional results with students"
            },
            {
                "CategoryId": 772,
                "Category": "STUDENT FOCUSED",
                "SubCategory": "Setting ambitious goals and holding oneself accountable"
            },
            {
                "CategoryId": 755,
                "Category": "FOREVER LEARNER",
                "SubCategory": "Catalyzing innovation, embracing failing forward"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Operations"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Special Programs"
            },
            {
                "CategoryId": 772,
                "Category": "STUDENT FOCUSED",
                "SubCategory": "Demonstrating a deep understanding of high-quality teaching"
            },
            {
                "CategoryId": 767,
                "Category": "RELATIONSHIP DRIVEN",
                "SubCategory": "Being culturally responsive and celebrating our rich diversity"
            },
            {
                "CategoryId": 766,
                "Category": "PROMISE 2 PURPOSE INVESTOR",
                "SubCategory": "Recognizing excellence and celebrating progress"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Efficiency/Time Management"
            },
            {
                "CategoryId": 755,
                "Category": "FOREVER LEARNER",
                "SubCategory": "Thoughtfully disrupting the status quo"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Recruit and select staff to ensure the building is fully-staffed with high-capacity individuals"
            },
            {
                "CategoryId": 766,
                "Category": "PROMISE 2 PURPOSE INVESTOR",
                "SubCategory": "Inspiring, coaching, encouraging, and developing others"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Oversee the school physical facility to create a safe and productive learning environment"
            },
            {
                "CategoryId": 767,
                "Category": "RELATIONSHIP DRIVEN",
                "SubCategory": "Skillfully communicating and gathering feedback from every voice"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Maximize and equitably allocate resources - time, money, talent, materials - to drive towards outcomes"
            },
            {
                "CategoryId": 755,
                "Category": "FOREVER LEARNER",
                "SubCategory": "Being joyful, reflective, transparent, and deliberate in applying our learning to change the world"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Student Supervision"
            },
            {
                "CategoryId": 772,
                "Category": "STUDENT FOCUSED",
                "SubCategory": "Insisting on high expectations and care for the whole learner."
            },
            {
                "CategoryId": 772,
                "Category": "STUDENT FOCUSED",
                "SubCategory": "Insists on high expectations and care for the whole learner"
            },
            {
                "CategoryId": 772,
                "Category": "STUDENT FOCUSED",
                "SubCategory": "Rigorously analyzing data and using it to ensure student progress"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Leverage technology, equipment, and other materials to ensure the success of teachers and students"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Adhere to federal, state, and district laws and policies for special populations and implement practices to create an inclusive school culture for ELLs, students with disabilities, and other special populations"
            },
            {
                "CategoryId": 766,
                "Category": "PROMISE 2 PURPOSE INVESTOR",
                "SubCategory": "Working interdependently to ignite and achieve our shared vision"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Student Discipline"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Hiring and Evaluation"
            },
            {
                "CategoryId": 772,
                "Category": "STUDENT FOCUSED",
                "SubCategory": "Being driven by a sense of urgency and a focus on results"
            },
            {
                "CategoryId": 766,
                "Category": "PROMISE 2 PURPOSE INVESTOR",
                "SubCategory": "Distributing leadership and empowering others"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Investigations"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Proactive Problem Solving"
            },
            {
                "CategoryId": 776,
                "Category": "TECHNICAL SKILLS",
                "SubCategory": "Implement the evaluation process with teachers; observe and coach teachers to improve their practice"
            }          
        ];

        return catSubCAtArr;
    }

    useEffect(() => {
        GetDegrees();
        GetPositionHistory();
        GetCertifications();
        GetCatergories();
    }, [])

    return {degrees, assignment, certifications, categories,
        setDegrees, setAssignment, setCertifications, setCategories}
}

export default UseAdvancedSearch;