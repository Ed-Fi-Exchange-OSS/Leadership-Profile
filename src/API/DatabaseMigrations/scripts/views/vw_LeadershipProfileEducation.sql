CREATE OR ALTER VIEW edfi.vw_LeadershipProfileEducation AS
SELECT
	s.StaffUSI,
	s.StaffUniqueId,
	tcds.MajorSpecialization,
	tcds.MinorSpecialization,
	tcds.EndDate
FROM edfi.Staff s
INNER JOIN tpdm.TeacherCandidate tc ON tc.PersonId = s.PersonId
INNER JOIN tpdm.TeacherCandidateDegreeSpecialization tcds ON tcds.TeacherCandidateIdentifier = tc.TeacherCandidateIdentifier
GROUP BY s.StaffUSI, s.StaffUniqueId, tcds.MajorSpecialization, tcds.MinorSpecialization, tcds.EndDate