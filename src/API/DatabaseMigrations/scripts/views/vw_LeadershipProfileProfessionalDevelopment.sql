CREATE OR ALTER VIEW edfi.vw_LeadershipProfileProfessionalDevelopment AS
SELECT
    s.StaffUSI,
    s.StaffUniqueId,
    pd.ProfessionalDevelopmentTitle,
    pd.AttendanceDate
FROM edfi.Staff s
INNER JOIN tpdm.ProfessionalDevelopmentEventAttendance pd ON pd.PersonId = s.PersonId


