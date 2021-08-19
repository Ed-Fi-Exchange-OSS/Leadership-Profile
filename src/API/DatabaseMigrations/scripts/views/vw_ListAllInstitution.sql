SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER  VIEW [edfi].[vw_ListAllInstitutions] AS
    SELECT DISTINCT 
        seoaa.EducationOrganizationId as [Value],
        eo.NameOfInstitution as [Text]
    FROM 
        edfi.StaffEducationOrganizationAssignmentAssociation seoaa
        INNER JOIN edfi.EducationOrganization eo ON eo.EducationOrganizationId = seoaa.EducationOrganizationId
    WHERE seoaa.EndDate IS NULL OR seoaa.EndDate >= GETUTCDATE()
GO
