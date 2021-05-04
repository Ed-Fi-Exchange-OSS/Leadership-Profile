CREATE OR ALTER VIEW [edfi].[vw_ListAllAssignments] AS
select distinct
     d.CodeValue as [Text]
    ,seoaa.StaffClassificationDescriptorId as [Value]
from edfi.StaffEducationOrganizationAssignmentAssociation seoaa
left join edfi.Descriptor d ON d.DescriptorId = seoaa.StaffClassificationDescriptorId

GO