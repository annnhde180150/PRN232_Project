using BussinessObjects.Models;
using Services.DTOs.Authentication;

namespace Services.Interfaces;

public interface IJwtService
{
    string GenerateJwtToken<T>(T user) where T : IAppUser;
    bool ValidateJwtToken(string token);
} 