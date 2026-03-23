
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

COPY SummerSeason/*.csproj ./SummerSeason/
RUN dotnet restore ./SummerSeason/SummerSeason.csproj

COPY SummerSeason/. ./SummerSeason/
WORKDIR /source/SummerSeason
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SummerSeason.dll"]