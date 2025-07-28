using AutoMapper;
using BussinessObjects.Models;
using Repositories.Interfaces;
using Services.DTOs.FavoriteHelper;
using Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Repositories;
using System;
using System.Linq;
using Services.DTOs.Helper;

namespace Services.Implements;

public class FavoriteHelperService : IFavoriteHelperService
{
    private readonly IFavoriteHelperRepository _favoriteRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public FavoriteHelperService(IFavoriteHelperRepository favoriteRepo, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _favoriteRepo = favoriteRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<FavoriteHelperDetailsDto> AddFavoriteAsync(FavoriteHelperCreateDto dto)
    {
        var existing = await _favoriteRepo.GetByUserAndHelperAsync(dto.UserId, dto.HelperId);
        if (existing != null) return _mapper.Map<FavoriteHelperDetailsDto>(existing);

        // Fetch related entities
        var user = await _unitOfWork.Users.GetByIdAsync(dto.UserId);
        var helper = await _unitOfWork.Helpers.GetByIdAsync(dto.HelperId);

        var entity = new FavoriteHelper {
            UserId = dto.UserId,
            HelperId = dto.HelperId,
            User = user!,
            Helper = helper!,
            DateAdded = DateTime.Now
        };
        await _favoriteRepo.AddAsync(entity);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<FavoriteHelperDetailsDto>(entity);
    }

    public async Task<IEnumerable<FavoriteHelperDetailsDto>> GetFavoritesByUserAsync(int userId)
    {
        var list = await _favoriteRepo.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<FavoriteHelperDetailsDto>>(list).ToList();
        for (int i = 0; i < dtos.Count(); i++)
        {
            var entity = list.ElementAt(i);
            if (entity.Helper != null)
            {
                dtos[i].HelperInfo = new HelperInfoDto
                {
                    HelperId = entity.Helper.HelperId,
                    FullName = entity.Helper.FullName,
                    Email = entity.Helper.Email,
                    ProfilePictureUrl = entity.Helper.ProfilePictureUrl
                };
            }
        }
        return dtos;
    }

    public async Task<bool> DeleteFavoriteAsync(FavoriteHelperDeleteDto dto)
    {
        var result = await _favoriteRepo.DeleteByUserAndHelperAsync(dto.UserId, dto.HelperId);
        if (result) await _unitOfWork.CompleteAsync();
        return result;
    }
} 