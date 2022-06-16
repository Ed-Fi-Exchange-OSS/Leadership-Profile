CREATE OR ALTER VIEW [edfi].[vw_ListAllSchoolCategories] AS


    SELECT
        d.CodeValue AS [Text]
        ,scd.SchoolCategoryDescriptorId AS [Value]
    FROM edfi.SchoolCategoryDescriptor AS scd
    LEFT JOIN edfi.Descriptor AS d ON d.DescriptorId = scd.SchoolCategoryDescriptorId
GO