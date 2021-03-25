CREATE OR ALTER VIEW edfi.vw_LeadershipProfileCertification AS
with certDescription as (
	SELECT distinct
		Credential.CredentialFieldDescriptorId
		, theDescriptors.CodeValue [Credential Field]
		, AcademicSubjectType.CodeValue [Certification Academic Subject]
		, AcademicSubjectType.Description [Certification Academic Subject Description]

	FROM EdFi.CredentialFieldDescriptor
	LEFT JOIN extension.Credential
		ON Credential.CredentialFieldDescriptorId = CredentialFieldDescriptor.CredentialFieldDescriptorId
	LEFT JOIN EdFi.Descriptor theDescriptors
		ON theDescriptors.DescriptorId = CredentialFieldDescriptor.CredentialFieldDescriptorId
	LEFT JOIN EdFi.AcademicSubjectDescriptor
		ON AcademicSubjectDescriptor.AcademicSubjectDescriptorId = CredentialFieldDescriptor.AcademicSubjectDescriptorId
	LEFT JOIN EdFi.AcademicSubjectType
		ON AcademicSubjectType.AcademicSubjectTypeId = AcademicSubjectDescriptor.AcademicSubjectTypeId
)
select
	 sc.StaffUSI
	,s.StaffUniqueId
	,COALESCE(cd.[Certification Academic Subject], cd.[Credential Field]) [Description]
	,ct.CodeValue as CredentialType
	,sc.IssuanceDate
	,cast(null as DATE) AS ExpirationDate
from extension.StaffCredential as sc
left join edfi.Staff as s on s.StaffUSI = sc.StaffUSI
left join edfi.CredentialType as ct ON ct.CredentialTypeId = sc.CredentialTypeId
left join certDescription as cd on cd.CredentialFieldDescriptorId = sc.CredentialFieldDescriptorId