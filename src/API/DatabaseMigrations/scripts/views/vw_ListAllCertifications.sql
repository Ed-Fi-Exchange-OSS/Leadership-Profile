SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER VIEW [edfi].[vw_ListAllCertifications] AS

select
     d.CodeValue as [Text]
    ,cfd.CredentialFieldDescriptorId as [Value]
from EdFi.CredentialFieldDescriptor as cfd
left join edfi.Descriptor as d on d.DescriptorId = cfd.CredentialFieldDescriptorId

GO