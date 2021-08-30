/** SET RANDOM-ISH DEGREES **/
DECLARE  @HighSchool INT, @Bachelors INT, @Masters INT, @Doctorate INT;

SELECT @HighSchool = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'High School Diploma';
SELECT @Bachelors = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'Bachelor''s';
SELECT @Masters = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'Masters''s';
SELECT @Doctorate = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'Doctorate';

UPDATE edfi.Staff SET HighestCompletedLevelOfEducationDescriptorId =
  CASE StaffUsi % 4
    WHEN 0 THEN @HighSchool
	WHEN 1 THEN @Bachelors
	WHEN 2 THEN @Masters
	ELSE @Doctorate
  END
WHERE HighestCompletedLevelOfEducationDescriptorId IS NULL
GO

/** SET RANDOM-ISH YEARS **/

UPDATE edfi.Staff
  SET YearsOfPriorProfessionalExperience = ((StaffUSI % 24)+1) + ((StaffUSI % 6) / 10.0)
  WHERE YearsOfPriorProfessionalExperience IS NULL OR YearsOfPriorProfessionalExperience = 0
GO

/** REPLACE SITE COORDINATORS WITH ASSISTANT PRINCIPALS **/

/* Change FK to cascade updates */
ALTER TABLE tpdm.StaffEducationOrganizationAssignmentAssociationExtension DROP CONSTRAINT FK_StaffEducationOrganizationAssignmentAssociationExtension_StaffEducationOrganizationAssignmentAssociation;
ALTER TABLE tpdm.StaffEducationOrganizationAssignmentAssociationExtension  WITH CHECK
  ADD  CONSTRAINT FK_StaffEducationOrganizationAssignmentAssociationExtension_StaffEducationOrganizationAssignmentAssociation
  FOREIGN KEY(BeginDate, EducationOrganizationId, StaffClassificationDescriptorId, StaffUSI)
  REFERENCES edfi.StaffEducationOrganizationAssignmentAssociation (BeginDate, EducationOrganizationId, StaffClassificationDescriptorId, StaffUSI)
  ON UPDATE CASCADE;

/* Update columns */
BEGIN TRANSACTION

DECLARE @SiteCoordinator INT, @AssistantPrincipal INT;

SELECT @SiteCoordinator = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://tpdm.ed-fi.org/StaffClassificationDescriptor' AND CodeValue = 'Site Coordinator';
SELECT @AssistantPrincipal = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/StaffClassificationDescriptor' AND CodeValue = 'Assistant Principal';

UPDATE edfi.StaffEducationOrganizationAssignmentAssociation
SET StaffClassificationDescriptorId = @AssistantPrincipal
WHERE StaffClassificationDescriptorId = @SiteCoordinator

UPDATE tpdm.StaffEducationOrganizationAssignmentAssociationExtension
SET StaffClassificationDescriptorId = @AssistantPrincipal
WHERE StaffClassificationDescriptorId = @SiteCoordinator

COMMIT

/* Restore original FK */
ALTER TABLE tpdm.StaffEducationOrganizationAssignmentAssociationExtension DROP CONSTRAINT FK_StaffEducationOrganizationAssignmentAssociationExtension_StaffEducationOrganizationAssignmentAssociation;
ALTER TABLE tpdm.StaffEducationOrganizationAssignmentAssociationExtension  WITH CHECK
  ADD  CONSTRAINT FK_StaffEducationOrganizationAssignmentAssociationExtension_StaffEducationOrganizationAssignmentAssociation
  FOREIGN KEY(BeginDate, EducationOrganizationId, StaffClassificationDescriptorId, StaffUSI)
  REFERENCES edfi.StaffEducationOrganizationAssignmentAssociation (BeginDate, EducationOrganizationId, StaffClassificationDescriptorId, StaffUSI)
  ON DELETE CASCADE;
GO
