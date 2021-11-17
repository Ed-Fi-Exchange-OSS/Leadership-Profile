CREATE OR ALTER VIEW [edfi].[vw_ListAllSchoolCategories] AS


    SELECT
        d.CodeValue AS [Text]
        , eocd.EducationOrganizationCategoryDescriptor AS [Value]
    FROM edfi.EducationOrganizationCategoryDescriptor AS eocd
    LEFT JOIN edfi.Descriptor AS d ON d.DescriptorId = eocd.EducationOrganizationCategoryDescriptorId
GO