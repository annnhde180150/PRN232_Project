using System;
using System.Collections.Generic;

namespace BussinessObjects.Models;

public partial class FavoriteHelper
{
    public int FavoriteId { get; set; }

    public int UserId { get; set; }

    public int HelperId { get; set; }

    public DateTime? DateAdded { get; set; }

    public virtual Helper Helper { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
