import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import config from '../../../config';

function UseAdvancedSearch(){
    function ApplyFilter(filters){
        console.log(filters)
    }

    function GetDegrees(){
        var degrees = {
            "degrees": [
                {
                    "Text": "Degree01",
                    "Value": 1
                },
                {
                    "Text": "Degree02",
                    "Value": 2
                },
                {
                    "Text": "Degree03",
                    "Value": 3
                },
                {
                    "Text": "Degree04",
                    "Value": 4
                }
            ]
        }

        return degrees;
    }

    function GetSpeciaizations(){

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

    function GetPositionHistory(){
        var positionhistory = {
            "assignments": [
              {
                "text": "Adjunct Professor",
                "value": 11448
              },
              {
                "text": "Assistant Principal",
                "value": 3381
              },
              {
                "text": "Assistant Professor",
                "value": 3382
              },
              {
                "text": "Associate Professor",
                "value": 3384
              },
              {
                "text": "Clinical Professor",
                "value": 3386
              },
              {
                "text": "Faculty",
                "value": 11452
              },
              {
                "text": "Full Professor",
                "value": 11453
              },
              {
                "text": "Instructor",
                "value": 11454
              },
              {
                "text": "Lecturer",
                "value": 11455
              },
              {
                "text": "Principal",
                "value": 3398
              },
              {
                "text": "Staff",
                "value": 11458
              },
              {
                "text": "Substitute Teacher",
                "value": 3408
              },
              {
                "text": "Teacher",
                "value": 3411
              },
              {
                "text": "Teaching",
                "value": 11459
              }
            ]
        };

        return positionhistory;
    }

    function GetCertifications(){
        var certifications = {
            "certifications": [
              {
                "text": "Agricultural Science and Technology",
                "value": 656
              },
              {
                "text": "Art",
                "value": 657
              },
              {
                "text": "Bilingual",
                "value": 658
              },
              {
                "text": "Bilingual Education Supplemental-Spanish",
                "value": 11352
              },
              {
                "text": "Bilingual Generalist-Spanish",
                "value": 659
              },
              {
                "text": "Bilingual Pre-K/Kindergarten-Spanish",
                "value": 11353
              },
              {
                "text": "Chemistry",
                "value": 11354
              },
              {
                "text": "Computer Science",
                "value": 660
              },
              {
                "text": "Core Subjects",
                "value": 11355
              },
              {
                "text": "Dance",
                "value": 11356
              },
              {
                "text": "Educational Aide I",
                "value": 11357
              },
              {
                "text": "Educational Aide II",
                "value": 11358
              },
              {
                "text": "Educational Aide III",
                "value": 11359
              },
              {
                "text": "Elementary Bilingual-Spanish",
                "value": 11360
              },
              {
                "text": "Elementary Education",
                "value": 661
              },
              {
                "text": "Elementary English as a Second Language",
                "value": 11361
              },
              {
                "text": "English",
                "value": 11362
              },
              {
                "text": "English as a Second Language Supplemental",
                "value": 11363
              },
              {
                "text": "English Language Arts and Reading",
                "value": 11364
              },
              {
                "text": "English Language Arts and Reading/Social Studies",
                "value": 11365
              },
              {
                "text": "Generalist",
                "value": 662
              },
              {
                "text": "Health",
                "value": 663
              },
              {
                "text": "History",
                "value": 11366
              },
              {
                "text": "Journalism",
                "value": 11367
              },
              {
                "text": "Languages Other Than English - Spanish",
                "value": 11368
              },
              {
                "text": "Life and Physical Sciences",
                "value": 664
              },
              {
                "text": "Master Teacher",
                "value": 665
              },
              {
                "text": "Mathematics",
                "value": 666
              },
              {
                "text": "Music",
                "value": 667
              },
              {
                "text": "Other",
                "value": 11369
              },
              {
                "text": "Physical Education",
                "value": 668
              },
              {
                "text": "Psychology",
                "value": 669
              },
              {
                "text": "Reading ",
                "value": 11370
              },
              {
                "text": "Science",
                "value": 11371
              },
              {
                "text": "Secondary Bilingual",
                "value": 11372
              },
              {
                "text": "Secondary Composite Science",
                "value": 11373
              },
              {
                "text": "Secondary English",
                "value": 11374
              },
              {
                "text": "Secondary English as a Second Language",
                "value": 11375
              },
              {
                "text": "Social Studies",
                "value": 670
              },
              {
                "text": "Social Studies",
                "value": 11376
              },
              {
                "text": "Special Education",
                "value": 11377
              },
              {
                "text": "Technology Applications:",
                "value": 11378
              },
              {
                "text": "Technology Education",
                "value": 11379
              }
            ]
          }
        
          return certifications;
    }

    function GetCatergories(){
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

    return {ApplyFilter, GetDegrees, GetSpeciaizations, 
        GetPositionHistory, GetCertifications, GetCatergories, 
        GetSubCategories}
}

export default UseAdvancedSearch;