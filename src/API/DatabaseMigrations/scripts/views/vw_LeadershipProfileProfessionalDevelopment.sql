CREATE OR ALTER VIEW edfi.vw_LeadershipProfileProfessionalDevelopment AS
SELECT
    s.StaffUSI,
    s.StaffUniqueId,
    sr.RecognitionDescription,
    sr.RecognitionAwardDate
FROM edfi.Staff s
-- INNER JOIN tpdm.ProfessionalDevelopmentEventAttendance pd ON pd.PersonId = s.PersonId
INNER JOIN edfi.StaffRecognition sr ON sr.StaffUSI = s.StaffUSI