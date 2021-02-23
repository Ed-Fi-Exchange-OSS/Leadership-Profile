/****** Object:  Table [dbo].[ProfileCompetency]    Script Date: 2/19/2021 4:59:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileCompetency]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileCompetency](
	[CompetencyId] [int] IDENTITY(1,1) NOT NULL,
	[StaffUsi] [int] NULL,
	[StaffUniqueId] [nvarchar](32) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CompetencyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO

/****** Object:  Table [dbo].[ProfileCategory]    Script Date: 2/19/2021 4:59:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileCategory]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileCategory](
	[CategoryId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryTitle] [nvarchar](32) NOT NULL,
	[CompetencyId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO

/****** Object:  Table [dbo].[ProfileSubCategory]    Script Date: 2/19/2021 4:59:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileSubCategory]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileSubCategory](
	[SubCategoryId] [int] IDENTITY(1,1) NOT NULL,
	[SubCatTitle] [nvarchar](32) NOT NULL,
	[SubCatNotes] [nvarchar](300) NOT NULL,
	[CategoryId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[SubCategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO

/****** Object:  Table [dbo].[ProfileScoresByPeriod]    Script Date: 2/19/2021 4:59:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileScoresByPeriod]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileScoresByPeriod](
	[ScoresByPeriodId] [int] IDENTITY(1,1) NOT NULL,
	[DistrictMin] [float] NULL,
	[DistrictMax] [float] NULL,
	[DistrictAvg] [float] NULL,
	[StaffScore] [float] NULL,
	[StaffScoreNotes] [nvarchar](75) NULL,
	[Period] [nvarchar](32) NULL,
	[SubCategoryId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ScoresByPeriodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ProfileCategory_ProfileCompetency_CompetencyId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ProfileCategory]'))
ALTER TABLE [dbo].[ProfileCategory]  WITH CHECK ADD  CONSTRAINT [FK_ProfileCategory_ProfileCompetency_CompetencyId] FOREIGN KEY([CompetencyId])
REFERENCES [dbo].[ProfileCompetency] ([CompetencyId])
ON DELETE CASCADE
GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ProfileCategory_ProfileCompetency_CompetencyId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ProfileCategory]'))
ALTER TABLE [dbo].[ProfileCategory] CHECK CONSTRAINT [FK_ProfileCategory_ProfileCompetency_CompetencyId]
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ProfileSubCategory_ProfileCategory_CategoryId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ProfileSubCategory]'))
ALTER TABLE [dbo].[ProfileSubCategory]  WITH CHECK ADD  CONSTRAINT [FK_ProfileSubCategory_ProfileCategory_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[ProfileCategory] ([CategoryId])
ON DELETE CASCADE
GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ProfileSubCategory_ProfileCategory_CategoryId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ProfileSubCategory]'))
ALTER TABLE [dbo].[ProfileSubCategory] CHECK CONSTRAINT [FK_ProfileSubCategory_ProfileCategory_CategoryId]
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ProfileScoresByPeriod_ProfileSubCategory_SubCategoryId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ProfileScoresByPeriod]'))
ALTER TABLE [dbo].[ProfileScoresByPeriod]  WITH CHECK ADD  CONSTRAINT [FK_ProfileScoresByPeriod_ProfileSubCategory_SubCategoryId] FOREIGN KEY([SubCategoryId])
REFERENCES [dbo].[ProfileSubCategory] ([SubCategoryId])
ON DELETE CASCADE
GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ProfileScoresByPeriod_ProfileSubCategory_SubCategoryId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ProfileScoresByPeriod]'))
ALTER TABLE [dbo].[ProfileScoresByPeriod] CHECK CONSTRAINT [FK_ProfileScoresByPeriod_ProfileSubCategory_SubCategoryId]
GO


