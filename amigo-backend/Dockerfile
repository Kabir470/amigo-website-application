# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /container-workspace

# Copy csproj and restore as distinct layers
COPY ["Amigo.Api/Amigo.Api.csproj", "Amigo.Api/"]
COPY ["Amigo.Application/Amigo.Application.csproj", "Amigo.Application/"]
COPY ["Amigo.Domain/Amigo.Domain.csproj", "Amigo.Domain/"]
COPY ["Amigo.Infrastructure/Amigo.Infrastructure.csproj", "Amigo.Infrastructure/"]
RUN dotnet restore "Amigo.Api/Amigo.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/container-workspace/Amigo.Api"
RUN dotnet publish "Amigo.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose the API port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Amigo.Api.dll"]
