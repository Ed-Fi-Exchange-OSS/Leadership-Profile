CREATE OR ALTER VIEW [edfi].[vw_ListAllCertifications] AS
select
     d.CodeValue as [Text]
    ,cfd.CredentialFieldDescriptorId as [Value]
from EdFi.CredentialFieldDescriptor as cfd
left join edfi.Descriptor as d on d.DescriptorId = cfd.CredentialFieldDescriptorId
GO