IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'TpdmUsername'
          AND Object_ID = Object_ID(N'edfi.Staff'))
BEGIN
    ALTER TABLE [edfi].[Staff]
    ADD TpdmUsername nvarchar(256)
END
