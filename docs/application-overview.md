# Application Overview

## System Architecture

The Leadership Portal comprises of 3 components:

- Portal UI
- Portal API
- Ed-Fi ODS Database

The Portal UI application provides an interface for registering users and viewing the staff directory. It makes requests to the Portal API application which in turn queries or manipulates the Ed-Fi ODS Database.

```ascii
    ┌───────┐
    │UI  App│
    └───┬───┘
        │ (http)
    ┌───▼───┐  ┌──┐
    │API App├─►│DB│
    └───────┘  └──┘
```

## Technologies Used

_For setup prerequisites, see [Readme.md](../Readme.md)._

### Portal UI Application

The UI application is written in JavaScript with the React front-end library and is served up by Node.js at run-time.

### Portal API Application

The API is written in C# using .NET Core 5. Its features are executed by [Mediatr handlers](https://github.com/jbogard/MediatR) and interfaces with the database using Entity Framework Core. Other libraries include [AutoMapper](https://github.com/AutoMapper/AutoMapper) to map from ‘domain’ models to ‘view’ models, and [XUnit](https://github.com/xunit/xunit) for unit testing.

### Ed-Fi ODS Database

The Leadership Portal supports Microsoft SQL Server 2019 running the Ed-Fi ODS. For more information see the [ODS repository](https://github.com/Ed-Fi-Alliance-OSS/Ed-Fi-ODS) and Ed-Fi [Tech Docs](https://techdocs.ed-fi.org/)
