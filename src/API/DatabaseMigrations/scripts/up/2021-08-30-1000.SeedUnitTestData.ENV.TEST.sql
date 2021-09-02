/*************************************
*     ENUMERATIONS / VALUES          *
*************************************/

/** DEGREES **/

DECLARE  @HighSchool INT, @Bachelors INT, @Masters INT, @Doctorate INT;

SELECT @HighSchool = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'High School Diploma';
SELECT @Bachelors = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'Bachelor''s';
SELECT @Masters = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'Master''s';
SELECT @Doctorate = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/LevelOfEducationDescriptor' AND CodeValue = 'Doctorate';

/** STAFF TITLES **/

DECLARE  @Teacher INT, @Principal INT, @AssistantPrincipal INT;

SELECT @Teacher = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/StaffClassificationDescriptor' AND CodeValue = 'Teacher';
SELECT @Principal = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/StaffClassificationDescriptor' AND CodeValue = 'Principal';
SELECT @AssistantPrincipal = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/StaffClassificationDescriptor' AND CodeValue = 'Assistant Principal';

/** Email Kinds **/

DECLARE @OrganizationEmail INT, @WorkEmail INT;

SELECT @OrganizationEmail = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/ElectronicMailTypeDescriptor' AND CodeValue = 'Organization';
SELECT @WorkEmail = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/ElectronicMailTypeDescriptor' AND CodeValue = 'Work';

/** Phone Kinds **/
DECLARE @WorkPhone INT, @MobilePhone INT;
SELECT @WorkPhone = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/TelephoneNumberTypeDescriptor' AND CodeValue = 'Work';
SELECT @MobilePhone = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/TelephoneNumberTypeDescriptor' AND CodeValue = 'Mobile';

/** Cert Credential Type **/

DECLARE @CertificationType INT;
SELECT @CertificationType = CredentialTypeDescriptorId
  FROM edfi.CredentialTypeDescriptor c
  JOIN edfi.Descriptor d ON d.DescriptorId = c.CredentialTypeDescriptorId
  WHERE d.Description = 'Certification';

/** State - TX **/

DECLARE @StateOfIssuance INT;
SELECT @StateOfIssuance = s.StateAbbreviationDescriptorId
  FROM edfi.StateAbbreviationDescriptor s JOIN edfi.Descriptor d ON d.DescriptorId = s.StateAbbreviationDescriptorId
  WHERE d.Description = 'TX';

/** Credential Field **/

DECLARE @Generalist NVARCHAR(60), @Mathematics NVARCHAR(60), @SocialStudies NVARCHAR(60), @Health NVARCHAR(60);
SELECT @Generalist = c.CredentialIdentifier
  FROM edfi.Credential c JOIN edfi.Descriptor d ON d.DescriptorId = c.CredentialFieldDescriptorId
  WHERE c.CredentialTypeDescriptorId = @CertificationType AND d.Description = 'Generalist';
SELECT @Mathematics = c.CredentialIdentifier
  FROM edfi.Credential c JOIN edfi.Descriptor d ON d.DescriptorId = c.CredentialFieldDescriptorId
  WHERE c.CredentialTypeDescriptorId = @CertificationType AND d.Description = 'Mathematics';
SELECT @SocialStudies = c.CredentialIdentifier
  FROM edfi.Credential c JOIN edfi.Descriptor d ON d.DescriptorId = c.CredentialFieldDescriptorId
  WHERE c.CredentialTypeDescriptorId = @CertificationType AND d.Description = 'Social Studies';
SELECT @Health = c.CredentialIdentifier
  FROM edfi.Credential c JOIN edfi.Descriptor d ON d.DescriptorId = c.CredentialFieldDescriptorId
  WHERE c.CredentialTypeDescriptorId = @CertificationType AND d.Description = 'Health';

/** Person System Source **/
DECLARE @SourceSystem INT;
SELECT @SourceSystem = DescriptorId FROM edfi.Descriptor WHERE Namespace='uri://ed-fi.org/SourceSystemDescriptor' AND CodeValue = 'District';


/*************************************
*             STAFF                  *
*************************************/

DECLARE @BartJackson INT = 90901;
DECLARE @MaryMuffet INT = 90902;
DECLARE @MartyJackson INT = 90903;
DECLARE @MartaMasterson INT = 90904;
DECLARE @BarryQuinoa INT = 90905;
DECLARE @DonaPage INT = 90906;
DECLARE @DonaldJones INT = 90907;
DECLARE @JacksonBonham INT = 90908;

INSERT INTO edfi.Person
  (PersonId, SourceSystemDescriptorId, CreateDate, LastModifiedDate, Id)
VALUES
    (@BartJackson, @SourceSystem, GETDATE(), GETDATE(), NEWID())
  , (@MaryMuffet, @SourceSystem, GETDATE(), GETDATE(), NEWID())
  , (@MartyJackson, @SourceSystem, GETDATE(), GETDATE(), NEWID())
  , (@MartaMasterson, @SourceSystem, GETDATE(), GETDATE(), NEWID())
  , (@BarryQuinoa, @SourceSystem, GETDATE(), GETDATE(), NEWID())
  , (@DonaPage, @SourceSystem, GETDATE(), GETDATE(), NEWID())
  , (@DonaldJones, @SourceSystem, GETDATE(), GETDATE(), NEWID())
  , (@JacksonBonham, @SourceSystem, GETDATE(), GETDATE(), NEWID())
;

SET IDENTITY_INSERT edfi.Staff ON;


INSERT INTO edfi.Staff
  (StaffUSI, FirstName, LastSurname, YearsOfPriorProfessionalExperience, HighestCompletedLevelOfEducationDescriptorId,  StaffUniqueId, BirthDate, CreateDate, LastModifiedDate, Id, PersonId)
VALUES
    (@BartJackson, 'Bartholomew', 'Jackson', 1, @Bachelors, '90901', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @BartJackson)
  , (@MaryMuffet, 'Mary', 'Muffet', 19, @Masters, '90902', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @MaryMuffet)
  , (@MartyJackson, 'Marty', 'Jackson', 16, @Masters, '90903', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @MartyJackson)
  , (@MartaMasterson, 'Marta', 'Masterson', 9, @Masters, '90904', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @MartaMasterson)
  , (@BarryQuinoa, 'Barry', 'Quinoa', 4, @Bachelors, '90905', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @BarryQuinoa)
  , (@DonaPage, 'Dona', 'Page', 35, @Doctorate, '90906', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @DonaPage)
  , (@DonaldJones, 'Donald', 'Jones', 26.5, @Doctorate, '90907', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @DonaldJones)
  , (@JacksonBonham, 'Jackson', 'Bonham', 21, @Bachelors, '90908', '1978-01-01', GETDATE(), GETDATE(), NEWID(), @JacksonBonham)
;

SET IDENTITY_INSERT edfi.Staff OFF;

/** Email **/

INSERT INTO edfi.StaffElectronicMail
  (StaffUSI, ElectronicMailAddress, ElectronicMailTypeDescriptorId, PrimaryEmailAddressIndicator, CreateDate)
VALUES
    (@BartJackson, 'bart.jackson@example.com', @OrganizationEmail, 1, GETDATE())
  , (@MaryMuffet, 'mary.muffet@example.com', @OrganizationEmail, 1, GETDATE())
  , (@MaryMuffet, 'mary.muffet2@example.com', @WorkEmail, 0, DATEADD(day,-1,GETDATE()))
  , (@MartyJackson, 'marty.jackson@example.com', @OrganizationEmail, 1, DATEADD(day,-1,GETDATE()))
  , (@MartaMasterson, 'marta.masterson@example.com', @OrganizationEmail, 1, GETDATE())
  , (@BarryQuinoa, 'barry.quinoa@example.com', @WorkEmail, 1, GETDATE())
  , (@BarryQuinoa, 'barry.quinoa2@example.com', @WorkEmail, 0, GETDATE())
  , (@DonaPage, 'dona.page@example.com', @WorkEmail, 1, GETDATE())
  , (@DonaPage, 'dona.page2@example.com', @OrganizationEmail, 0, GETDATE())
  , (@DonaldJones, 'donald.jones@example.com', @OrganizationEmail, 1, GETDATE())
;

/** Phone Numbers **/

INSERT INTO edfi.StaffTelephone
  (StaffUSI, TelephoneNumber, TelephoneNumberTypeDescriptorId, OrderOfPriority, CreateDate)
VALUES
    (@BartJackson, '555-123-4567', @WorkPhone, 1, GETDATE())
  , (@MaryMuffet, '555-456-7890', @WorkPhone, 1, GETDATE())
  , (@MaryMuffet, '554-123-4567', @WorkPhone, 1, DATEADD(day,-1,GETDATE()))
  , (@MartyJackson, '654-321-0987', @WorkPhone, 1, DATEADD(day,-1,GETDATE()))
  , (@MartaMasterson, '875-043-2193', @WorkPhone, 1, GETDATE())
  , (@BarryQuinoa, '512-456-3222', @WorkPhone, 1, GETDATE())
  , (@BarryQuinoa, '555-409-2111', @WorkPhone, 2, GETDATE())
  , (@DonaPage, '623-211-2222', @WorkPhone, 1, GETDATE())
  , (@DonaPage, '623-211-3333', @WorkPhone, 2, GETDATE())
  , (@DonaldJones, '555-444-3333', @WorkPhone, 1, GETDATE())
;

/*************************************
*          ASSIGNMENTS               *
*************************************/

/** SCHOOLS **/

DECLARE @AceElementary INT = 90000;
DECLARE @GreenpondElementary INT = 90001;
DECLARE @LemmElementary INT = 90002;
DECLARE @DransonElementary INT = 90003;
DECLARE @MaverickElementary INT = 90005;
DECLARE @CharlestonIntermediate INT = 90004;
DECLARE @McHanbersIntermediate INT = 90006;
DECLARE @RogersHigh INT = 900;
DECLARE @CarterCollins INT = 90011;
DECLARE @MountainOak INT = 90012;

INSERT INTO edfi.EducationOrganization
  (EducationOrganizationId, NameOfInstitution, Discriminator, CreateDate, LastModifiedDate, ID)
VALUES
    (@AceElementary, 'Ace Elementary School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@GreenpondElementary, 'Greenpond Elementary School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@LemmElementary, 'Lemm Elementary School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@DransonElementary, 'Dranson Elementary School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@MaverickElementary, 'Maverick Elementary School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@CharlestonIntermediate, 'Charleston Intermediate School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@McHanbersIntermediate, 'McHambers Intermediate School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@RogersHigh, 'Rogers High School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@CarterCollins, 'Carter Collins High School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
  , (@MountainOak, 'Mountain Oak High School', 'edfi.School', GETDATE(), GETDATE(), NEWID())
;

/** LATEST ASSIGNMENTS **/

INSERT INTO edfi.StaffEducationOrganizationAssignmentAssociation
  (StaffUsi, EducationOrganizationId, StaffClassificationDescriptorId, PositionTitle, BeginDate, EndDate, CreateDate, LastModifiedDate, Id)
VALUES
    (@BartJackson, @AceElementary, @Teacher, 'Teacher', DATEADD(year,-10,GETDATE()), NULL, GETDATE(), GETDATE(), NEWID())
  , (@MaryMuffet,  @LemmElementary, @Principal, 'Principal', DATEADD(month,-6,GETDATE()), NULL, GETDATE(), GETDATE(), NEWID())
  , (@MartyJackson, @LemmElementary, @AssistantPrincipal, 'Assistant Principal', DATEADD(year,-1,GETDATE()), NULL, GETDATE(), GETDATE(), NEWID())
  , (@MartaMasterson, @McHanbersIntermediate,  @Teacher, 'Teacher', DATEADD(day,-100,GETDATE()), NULL, GETDATE(), GETDATE(), NEWID())
  , (@BarryQuinoa, @CharlestonIntermediate, @Principal, 'Principal', DATEADD(year,-10,GETDATE()), DATEADD(day,-1,GETDATE()), GETDATE(), GETDATE(), NEWID())
  , (@DonaPage, @RogersHigh, @AssistantPrincipal, 'Assistant Principal', DATEADD(day,-600,GETDATE()), NULL, GETDATE(), GETDATE(), NEWID())
  , (@DonaldJones, @CarterCollins, @AssistantPrincipal, 'Assistant Principal', DATEADD(month,-3,GETDATE()), NULL, GETDATE(), GETDATE(), NEWID())
  , (@JacksonBonham, @CarterCollins, @Principal, 'Principal', DATEADD(day,-892,GETDATE()), NULL, GETDATE(), GETDATE(), NEWID())
;

/** ASSIGNMENT HISTORY **/
INSERT INTO edfi.StaffEducationOrganizationAssignmentAssociation
  (StaffUsi, EducationOrganizationId, StaffClassificationDescriptorId, PositionTitle, BeginDate, EndDate, CreateDate, LastModifiedDate, Id)
VALUES
    (@MaryMuffet,  @LemmElementary, @AssistantPrincipal, 'Assistant Principal', DATEADD(month,-12,GETDATE()), DATEADD(month,-6,GETDATE()), DATEADD(day, -1, GETDATE()), GETDATE(), NEWID())
  , (@MaryMuffet,  @DransonElementary, @AssistantPrincipal, 'Assistant Principal', DATEADD(month,-24,GETDATE()), DATEADD(month,-12,GETDATE()), DATEADD(day, -2, GETDATE()), GETDATE(), NEWID())
  , (@MaryMuffet,  @DransonElementary, @Teacher, 'Teacher', DATEADD(month,-24,GETDATE()), DATEADD(month,-32,GETDATE()), DATEADD(day, -3, GETDATE()), GETDATE(), NEWID())
  , (@MartyJackson, @McHanbersIntermediate, @AssistantPrincipal, 'Assistant Principal', DATEADD(year,-2,GETDATE()), DATEADD(year,-1,GETDATE()), DATEADD(day, -1, GETDATE()), GETDATE(), NEWID())
  , (@MartaMasterson, @CharlestonIntermediate,  @Teacher, 'Teacher', DATEADD(day,-200,GETDATE()), DATEADD(day,-100,GETDATE()), DATEADD(day, -1, GETDATE()), GETDATE(), NEWID())
  , (@MartaMasterson, @AceElementary,  @Teacher, 'Teacher', DATEADD(day,-400,GETDATE()), DATEADD(day,-200,GETDATE()), DATEADD(day, -2, GETDATE()), GETDATE(), NEWID())
  , (@BarryQuinoa, @McHanbersIntermediate, @Principal, 'Principal', DATEADD(year,-11,GETDATE()), DATEADD(year,-10,GETDATE()), DATEADD(day, -1, GETDATE()), GETDATE(), NEWID())
  , (@BarryQuinoa, @CarterCollins, @AssistantPrincipal, 'Assistant Principal', DATEADD(year,-12,GETDATE()), DATEADD(year,-11,GETDATE()), DATEADD(day, -2, GETDATE()), GETDATE(), NEWID())
  , (@DonaldJones, @MountainOak, @AssistantPrincipal, 'Assistant Principal', DATEADD(year,-3,GETDATE()), DATEADD(month,-3,GETDATE()), DATEADD(day, -1, GETDATE()), GETDATE(), NEWID())
  , (@DonaldJones, @MountainOak, @Teacher, 'Teacher', DATEADD(year,-5,GETDATE()), DATEADD(year,-3,GETDATE()), DATEADD(day, -2, GETDATE()), GETDATE(), NEWID())
  , (@JacksonBonham, @MountainOak, @Principal, 'Principal', DATEADD(day,-3200,GETDATE()), DATEADD(day,-892,GETDATE()), DATEADD(day, -1, GETDATE()), GETDATE(), NEWID())
;

/*************************************
*          CERTIFICATIONS            *
*************************************/

/** Staff Certs **/

INSERT INTO edfi.StaffCredential
  (StaffUsi, CredentialIdentifier, StateOfIssueStateAbbreviationDescriptorId, CreateDate)
VALUES
    (@BartJackson, @Generalist, @StateOfIssuance, GETDATE())
  , (@MaryMuffet, @Mathematics, @StateOfIssuance, GETDATE())
  , (@MaryMuffet, @Generalist, @StateOfIssuance, GETDATE())
  , (@MartyJackson, @Generalist, @StateOfIssuance, GETDATE())
  , (@MartaMasterson, @Generalist, @StateOfIssuance, GETDATE())
  , (@BarryQuinoa, @Health, @StateOfIssuance, GETDATE())
  , (@BarryQuinoa, @SocialStudies, @StateOfIssuance, GETDATE())
  , (@DonaPage, @Generalist, @StateOfIssuance, GETDATE())
  , (@DonaldJones, @Mathematics, @StateOfIssuance, GETDATE())
;
