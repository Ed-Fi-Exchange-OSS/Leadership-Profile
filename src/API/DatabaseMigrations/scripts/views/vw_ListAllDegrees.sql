/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW [edfi].[vw_ListAllDegrees] AS
With SelectedDegrees ([Name], [Order]) as (
	Select 'Associate''s Degree (two years or more)', 1
	Union
	Select 'Bachelor''s', 2
	Union
	Select 'Master''s', 3
	Union
	Select 'Doctorate', 4
)
Select Top 100 percent
     Replace(d.CodeValue, ' Degree (two years or more)','') as [Text]
    ,lod.LevelOfEducationDescriptorId as [Value]
	, sd.[Order]
from edfi.LevelOfEducationDescriptor as lod
left join edfi.Descriptor as d on d.DescriptorId = lod.LevelOfEducationDescriptorId
inner join SelectedDegrees sd on d.CodeValue = sd.Name
order by sd.[Order]

GO
