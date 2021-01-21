CREATE OR ALTER VIEW edfi.vw_LeadershipProfileCertifications AS
SELECT
	s.StaffUSI,
	s.StaffUniqueId,
    credentialDesc.Description 'Description',
    credentialType.Description CredentialType,
    IssuanceDate,
    ExpirationDate
FROM edfi.Credential c
INNER JOIN edfi.StaffCredential sc ON sc.CredentialIdentifier = c.CredentialIdentifier
INNER JOIN edfi.Descriptor credentialType ON credentialType.DescriptorId = c.CredentialTypeDescriptorId
INNER JOIN edfi.Descriptor credentialDesc ON credentialDesc.DescriptorId = c.CredentialFieldDescriptorId
INNER JOIN edfi.Staff s ON s.StaffUSI = sc.StaffUSI