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

# Disable inotify-based config file watching.
# Render.com shared-kernel containers have a hard limit of 128 inotify instances across ALL
# containers on the same host. When the host is busy this limit is exhausted and the .NET
# host builder crashes with IOException before any user code runs.
# DOTNET_hostBuilder__reloadConfigOnChange=false tells the ASP.NET Core host builder to use
# reloadOnChange:false for all default appsettings.json sources — consuming zero inotify slots.
ENV DOTNET_hostBuilder__reloadConfigOnChange=false

ENTRYPOINT ["dotnet", "Amigo.Api.dll"]
