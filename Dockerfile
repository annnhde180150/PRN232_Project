# Use the official .NET 8 SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and projects
COPY HomeHelperFinderAPI.sln ./
COPY HomeHelperFinderAPI/*.csproj ./HomeHelperFinderAPI/
COPY Services/*.csproj ./Services/
COPY Repositories/*.csproj ./Repositories/
COPY BussinessObjects/*.csproj ./BussinessObjects/

# Restore dependencies
RUN dotnet restore "HomeHelperFinderAPI.sln"

# Copy the rest of the source code
COPY . .

# Build and publish
RUN dotnet publish "HomeHelperFinderAPI/HomeHelperFinderAPI.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .


# Expose port 8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "HomeHelperFinderAPI.dll"]