
/****** Object:  Table [dbo].[ProfileCompetency]    Script Date: 2/19/2021 2:48:19 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileCompetency]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileCompetency](
	[CompetencyId] [int] IDENTITY(1,1) NOT NULL,
	[StaffUsi] [int] NULL,
	[StaffUniqueId] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[CompetencyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO

/****** Object:  Table [dbo].[ProfileCategory]    Script Date: 2/19/2021 2:50:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileCategory]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileCategory](
	[CategoryId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryTitle] [varchar](max) NULL,
	[CompetenciesId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

ALTER TABLE [dbo].[ProfileCategory]  WITH CHECK ADD FOREIGN KEY([CompetenciesId])
REFERENCES [dbo].[ProfileCompetency] ([CompetencyId])
END
GO

/****** Object:  Table [dbo].[ProfileSubCategory]    Script Date: 2/19/2021 2:50:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileSubCategory]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileSubCategory](
	[SubCategoryId] [int] IDENTITY(1,1) NOT NULL,
	[SubCatTitle] [varchar](max) NULL,
	[SubCatNotes] [varchar](max) NULL,
	[CategoryId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[SubCategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

ALTER TABLE [dbo].[ProfileSubCategory]  WITH CHECK ADD FOREIGN KEY([CategoryId])
REFERENCES [dbo].[ProfileCategory] ([CategoryId])
END
GO

/****** Object:  Table [dbo].[ProfileScoresByPeriod]    Script Date: 2/19/2021 3:04:39 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProfileScoresByPeriod]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProfileScoresByPeriod](
	[ScoresByPeriodId] [int] IDENTITY(1,1) NOT NULL,
	[DistrictMin] [float] NULL,
	[DistrictMax] [float] NULL,
	[DistrictAvg] [float] NULL,
	[StaffScore] [float] NULL,
	[StaffScoreNotes] [varchar](max) NULL,
	[Period] [varchar](max) NULL,
	[SubCategoryId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ScoresByPeriodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

ALTER TABLE [dbo].[ProfileScoresByPeriod]  WITH CHECK ADD FOREIGN KEY([SubCategoryId])
REFERENCES [dbo].[ProfileSubCategory] ([SubCategoryId])
END
GO

