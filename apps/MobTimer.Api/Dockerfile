#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see http://aka.ms/containercompat 

FROM microsoft/dotnet:3.0-aspnetcore-runtime-nanoserver-1803 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:3.0-sdk-nanoserver-1803 AS build
WORKDIR /src
COPY apps/MobTimer.Api/Dockerfile/MobTimer.Api.csproj apps/MobTimer.Api/
RUN dotnet restore apps/MobTimer.Api/MobTimer.Api.csproj
COPY . .
WORKDIR /src/apps/MobTimer.Api
RUN dotnet build MobTimer.Api.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish MobTimer.Api.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "MobTimer.Api.dll"]
