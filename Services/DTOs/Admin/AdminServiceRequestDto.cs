using System;
using System.Collections.Generic;

namespace Services.DTOs.Admin
{
    public class AdminServiceRequestDto
    {
        public int RequestId { get; set; }
        public AdminUserInfoDto User { get; set; } = null!;
        public AdminHelperInfoDto? Helper { get; set; }
        public List<string> Services { get; set; } = new List<string>();
        public DateTime ScheduledTime { get; set; }
        public string Location { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime? RequestCreationTime { get; set; }
        public string? SpecialNotes { get; set; }
        public decimal? RequestedDurationHours { get; set; }
    }

    public class AdminUserInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
    }

    public class AdminHelperInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }

    public class AdminServiceRequestListDto
    {
        public List<AdminServiceRequestDto> Requests { get; set; } = new List<AdminServiceRequestDto>();
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class AdminServiceRequestFilterDto
    {
        public string? Status { get; set; }
        public string? User { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? Location { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
