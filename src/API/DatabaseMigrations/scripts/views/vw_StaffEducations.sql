CREATE OR ALTER VIEW [edfi].[vw_StaffEducations]
AS
WITH theBasis AS (
	SELECT
		StaffTeacherPreparationProgram.StaffUSI
		, StaffTeacherPreparationProgram.TeacherPreparationProgramName
		, theStaff.StaffUniqueId
		, CASE
			WHEN
				DegreesAwarded.CodeValue IN ('Masters', 'Master', 'M.ED', 'MED', 'MS', 'MA')
				OR DegreesAwarded.CodeValue LIKE 'MA-%'
				OR DegreesAwarded.CodeValue LIKE 'Master%'
				OR DegreesAwarded.CodeValue LIKE 'MBA%'
				OR DegreesAwarded.CodeValue LIKE 'M. Ed%'
				OR DegreesAwarded.CodeValue LIKE 'MA %'
				OR DegreesAwarded.CodeValue LIKE 'MA-%'
				OR DegreesAwarded.CodeValue LIKE 'MS %'
				OR DegreesAwarded.CodeValue LIKE 'MS-%'		
			THEN 'Masters'

			WHEN 
				DegreesAwarded.CodeValue IN ('BACHELORS', 'BFA', 'BA', 'BS') 
				OR DegreesAwarded.CodeValue LIKE 'Bach%'
				OR DegreesAwarded.CodeValue LIKE 'B.A.%'
				OR DegreesAwarded.CodeValue LIKE 'BA %'
				OR DegreesAwarded.CodeValue LIKE 'B.S.%'
				OR DegreesAwarded.CodeValue LIKE 'BS %'
			THEN 'Bachelors'

			WHEN 
				DegreesAwarded.CodeValue IN ('CERT', 'HVACR CERTIFIED', 'TEACHING CERTIFICATION') 
				OR DegreesAwarded.CodeValue LIKE 'Certif%'			
			THEN 'Certificate'

			WHEN 
				DegreesAwarded.CodeValue IN ('DOCTORATE', 'ED.D.')
				OR DegreesAwarded.CodeValue LIKE 'DOCTOR%'
			THEN 'Doctorate'

			WHEN 
				DegreesAwarded.CodeValue IN ('Associates', 'Assoc', 'Associates') 
				OR DegreesAwarded.CodeValue LIKE 'Assoc%'
			THEN 'Associates'

			WHEN 
				DegreesAwarded.CodeValue IN ('NO DEGREE', 'None', 'N/A') 
			THEN 'No Degree'

		ELSE 'Other'
		END [DegreeType]
		, DegreesAwarded.CodeValue [DegreeAwarded]
		, StaffTeacherPreparationProgram.NameOfInstitution [InstitutionAttended]
		, StaffTeacherPreparationProgram.MajorSpecialization [MajorOrSpecialization]
		, StaffTeacherPreparationProgram.GPA
		, ProgramCategorization.[ProgramType]

	FROM extension.StaffTeacherPreparationProgram
	LEFT JOIN edfi.Staff theStaff ON theStaff.StaffUSI = StaffTeacherPreparationProgram.StaffUSI
	JOIN extension.LevelOfDegreeAwardedDescriptor ON 
		LevelOfDegreeAwardedDescriptor.LevelOfDegreeAwardedDescriptorId
		= StaffTeacherPreparationProgram.LevelOfDegreeAwardedDescriptorId
	JOIN EdFi.Descriptor DegreesAwarded ON
		DegreesAwarded.DescriptorId = LevelOfDegreeAwardedDescriptor.LevelOfDegreeAwardedDescriptorId

	LEFT JOIN (
		SELECT DISTINCT 
			Descriptor.CodeValue [ProgramType]
			, Descriptor.Description
			, StaffTeacherPreparationProgram.TeacherPreparationProgramTypeDescriptorId 
		FROM extension.StaffTeacherPreparationProgram
		JOIN EdFi.Descriptor ON
			Descriptor.DescriptorId = StaffTeacherPreparationProgram.TeacherPreparationProgramTypeDescriptorId 
	)ProgramCategorization
		ON ProgramCategorization.TeacherPreparationProgramTypeDescriptorId = StaffTeacherPreparationProgram.TeacherPreparationProgramTypeDescriptorId
	)

	SELECT *
	FROM theBasis
GO