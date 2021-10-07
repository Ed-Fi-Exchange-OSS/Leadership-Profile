# Data Views

This document outlines the data elements used across the site, as organized by the SQL Views leveraged on each page. In order for the site to function, the columns and tables below must be populated and related between each other accurately. Use it in conjunction with the [TPDM Handbook](https://schema.ed-fi.org/tpdm-handbook-v10/Index.html#/Staff583) for more context.

- Directory / Search
- Profile

## Directory Search

The directory search is defined in `edfi.vw_StaffSearch.sql`. While most fields are present in the SQL View, note the application applies pagination to the results, as well as a conditional join for one of the filters, as outline below. This View can be used alone to return an "unfiltered" directory result.

Additionally, the View itself uses Common Table Expressions to limit to most recent or first results (for example the most recent `StaffEducationOrganizationAssignmentAssociation`) details can be seen on the View itself, with this list demonstrating what columns must be populated in what tables:

- `edfi.Staff.StaffUSI`
- `edfi.Staff.StaffUniqueId`
- `edfi.Staff.FirstName`
- `edfi.Staff.MiddleName`
- `edfi.Staff.LastSurname`
- `edfi.Staff.YearsOfPriorProfessionalExperience`
- `edfi.StaffEducationOrganizationAssignmentAssociation`
  - `.BeginDate`
  - `.EducationOrganization.StaffClassificationDescriptorId`
    - _also `JOIN`s `edfi.Descriptor` for text value_
  - `.EducationOrganization.EducationOrganizationId`
  - `.EducationOrganization.NameOfInstitution`
- `edfi.Staff.HighestCompletedLevelOfEducationDescriptorId`
  - _also `JOIN`s `edfi.Descriptor` for text value_
- `edfi.StaffElectronicMail.Email`
- `edfi.StaffTelephone.TelephoneNumber`

Staff Performance Ratings are filtered using `edfi.vw_StaffObjectiveRatings.sql`, drawing from `tpdm.EvaluationObjectiveRatingResult`.
This SQL View only returns _the most recent rating_ per each Domain (`Objective`), ordered by `tpdm.EvaluationObjectiveRatingResult.EvaluationDate`. This View is `JOIN`ed on conditionally when a user includes a Performance Rating filter.

- `edfi.Staff.StaffUSI`
- `tpdm.EvaluationObjectiveRatingResult.EvaluationObjectiveTitle`
- `tpdm.EvaluationObjectiveRatingResult.Rating`

### Filter Select Lists

The dropdown options on the Directory page utilize the following. In an effort to be concise, most `JOIN` between tables to only include values that are utilized by staff. For details, see the views themselves.

#### Positions

`edfi.vw_ListAllAssignments.sql`

- Text: `edfi.Descriptor.CodeValue`
- Value: `edfi.StaffEducationOrganizationAssignmentAssociation.StaffClassificationDescriptorId`

#### Schools

`edfi.vw_ListAllInstitution.sql`

- Text: `edfi.EducationOrganization.NameOfInstitution`
- Value: `edfi.StaffEducationOrganizationAssignmentAssociation.EducationOrganizationId`

#### Performance Domains

`edfi.vw_ListAllCategories.sql`

- Text & Value: `tpdm.EvaluationObjectiveEvaluationObjectiveTitle`

#### Degrees

`edfi.vw_ListAllDegrees.sql`

- Text: `edfi.Descriptor.CodeValue`
- Value: `edfi.LevelOfEducationDescriptor.LevelOfEducationDescriptorId`

## Profile

### Header

`edfi.vw_LeadershipProfileHeader.sql`

- `edfi.Staff.StaffUSI`
- `edfi.Staff.StaffUniqueId`
- `edfi.Staff.FirstName`
- `edfi.Staff.MiddleName`
- `edfi.Staff.LastSurname`
- `edfi.StaffAddress.City`
- `edfi.Staff.YearsOfPriorProfessionalExperience`
- `edfi.StaffEducationOrganizationAssignmentAssociation`
  - `.EducationOrganization.StaffClassificationDescriptorId`
    - _also `JOIN`s `edfi.Descriptor` for text value_
  - `.EducationOrganization.NameOfInstitution`
- `edfi.StaffElectronicMail.Email`
- `edfi.StaffTelephone.TelephoneNumber`

### Position History

`edfi.vw_LeadershipProfilePositionHistory.sql`

- `edfi.Staff.StaffUSI`
- `edfi.Staff.StaffUniqueId`
- `edfi.StaffEducationOrganizationAssignmentAssociation`
  - `.BeginDate`
  - `.EndDate`
  - `.EducationOrganization.StaffClassificationDescriptorId`
    - _also `JOIN`s `edfi.Descriptor` for text value_
  - `.EducationOrganization.NameOfInstitution`

### Certifications

`edfi.vw_LeadershipProfileCertification.sql`

- `edfi.Staff.StaffUSI`
- `edfi.Staff.StaffUniqueId`
- `edfi.Credential.CredentialTypeDescriptorId`
  - _also `JOIN`s `edfi.Descriptor` for text value_
- `edfi.Credential.CredentialFieldDescriptorId`
  - _also `JOIN`s `edfi.Descriptor` for text value_
- `edfi.Credential.IssuanceDate`
- `edfi.Credential.ExpirationDate`

### Professional Development and Learning Experiences

`edfi.vw_LeadershipProfileProfessionalDevelopment.sql`

- `edfi.Staff.StaffUSI`
- `edfi.Staff.StaffUniqueId`
- `tpdm.ProfessionalDevelopmentEventAttendance.PersonId`
- `tpdm.ProfessionalDevelopmentEventAttendance.ProfessionalDevelopmentTitle`
- `tpdm.ProfessionalDevelopmentEventAttendance.AttendanceDate`

### Performance

The Performance charts on the profile require some functionality at the API code layer to support selecting by Year and other display features in a performant manner. These Views, however, will provide a representative set of evaluation data that can be grouped and manipulated using SQL as well.

Both of these Views use a `OVER` `PARTITION / ORDER BY` column called `EvalNumber` to allow accurate ordering and grouping of results by Year (assuming one evaluation per year). See the Views for details.

#### Overview

`edfi.vw_LeadershipProfileEvaluationObjective.sql`

- `edfi.Staff.StaffUSI`
- `edfi.Staff.StaffUniqueId`
- `EvalNumber`
- `tpdm.EvaluationObjectiveRatingResult`
  - `.PersonId`
  - `.EvaluationObjectiveTitle`
  - `.Rating`
  - `.SchoolYear`

#### Per-Domain (Indicators)

`edfi.vw_LeadershipProfileEvaluationElement.sql`

- `edfi.Staff.StaffUSI`
- `edfi.Staff.StaffUniqueId`
- `EvalNumber`
- `tpdm.EvaluationElementRatingResult`
  - `.PersonId`
  - `.EvaluationObjectiveTitle`
  - `.EvaluationElementTitle`
  - `.Rating`
  - `.SchoolYear`
