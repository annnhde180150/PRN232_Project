using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static BussinessObjects.Models.Helper;

namespace BussinessObjects.Models;

public partial class Prn232HomeHelperFinderSystemContext : DbContext
{
    public Prn232HomeHelperFinderSystemContext()
    {
    }

    public Prn232HomeHelperFinderSystemContext(
        DbContextOptions<Prn232HomeHelperFinderSystemContext> options
    )
        : base(options)
    {
    }

    public virtual DbSet<AdminUser> AdminUsers { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Chat> Chats { get; set; }

    public virtual DbSet<Connection> Connections { get; set; }

    public virtual DbSet<FavoriteHelper> FavoriteHelpers { get; set; }

    public virtual DbSet<Helper> Helpers { get; set; }

    public virtual DbSet<HelperDocument> HelperDocuments { get; set; }

    public virtual DbSet<HelperSkill> HelperSkills { get; set; }

    public virtual DbSet<HelperWallet> HelperWallets { get; set; }

    public virtual DbSet<HelperWorkArea> HelperWorkAreas { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<OtpVerification> OtpVerifications { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<ServiceRequest> ServiceRequests { get; set; }

    public virtual DbSet<SupportTicket> SupportTickets { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserAddress> UserAddresses { get; set; }

    public virtual DbSet<WalletTransaction> WalletTransactions { get; set; }

    public virtual DbSet<WithdrawalRequest> WithdrawalRequests { get; set; }

    public virtual DbSet<ReviewReport> ReviewReports { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", true, true);
        var configuration = builder.Build();
        optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__AdminUse__719FE4E8FCCE94E0");

            entity.HasIndex(e => e.Username, "UQ__AdminUse__536C85E49000CC47").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__AdminUse__A9D10534D4CE2C9E").IsUnique();

            entity.Property(e => e.AdminId).HasColumnName("AdminID");
            entity.Property(e => e.CreationDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(100).IsUnicode(false);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__73951ACD92FB321F");

            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.BookingCreationTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CancelledBy).HasMaxLength(10);
            entity.Property(e => e.EstimatedPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.FinalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity
                .HasOne(d => d.Helper)
                .WithMany(p => p.Bookings)
                .HasForeignKey(d => d.HelperId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bookings__Helper__73BA3083");

            entity
                .HasOne(d => d.Request)
                .WithMany(p => p.Bookings)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__Bookings__Reques__71D1E811");

            entity.Navigation(b => b.Service).AutoInclude();
            entity.Navigation(b => b.User).AutoInclude();
        });

        modelBuilder.Entity<Chat>(entity =>
        {
            entity.HasKey(e => e.ChatId).HasName("PK__Chats__A9FBE6264EF27BF8");

            entity.Property(e => e.ChatId).HasColumnName("ChatID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.IsModerated).HasDefaultValue(false);
            entity.Property(e => e.IsReadByReceiver).HasDefaultValue(false);
            entity.Property(e => e.ModeratorAdminId).HasColumnName("ModeratorAdminID");
            entity.Property(e => e.ReceiverHelperId).HasColumnName("ReceiverHelperID");
            entity.Property(e => e.ReceiverUserId).HasColumnName("ReceiverUserID");
            entity.Property(e => e.SenderHelperId).HasColumnName("SenderHelperID");
            entity.Property(e => e.SenderUserId).HasColumnName("SenderUserID");
            entity.Property(e => e.Timestamp).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.Booking)
                .WithMany(p => p.Chats)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__Chats__BookingID__14270015");

            entity
                .HasOne(d => d.ModeratorAdmin)
                .WithMany(p => p.Chats)
                .HasForeignKey(d => d.ModeratorAdminId)
                .HasConstraintName("FK__Chats__Moderator__18EBB532");

            entity
                .HasOne(d => d.ReceiverHelper)
                .WithMany(p => p.ChatReceiverHelpers)
                .HasForeignKey(d => d.ReceiverHelperId)
                .HasConstraintName("FK__Chats__ReceiverH__17F790F9");

            entity
                .HasOne(d => d.ReceiverUser)
                .WithMany(p => p.ChatReceiverUsers)
                .HasForeignKey(d => d.ReceiverUserId)
                .HasConstraintName("FK__Chats__ReceiverU__17036CC0");

            entity
                .HasOne(d => d.SenderHelper)
                .WithMany(p => p.ChatSenderHelpers)
                .HasForeignKey(d => d.SenderHelperId)
                .HasConstraintName("FK__Chats__SenderHel__160F4887");

            entity
                .HasOne(d => d.SenderUser)
                .WithMany(p => p.ChatSenderUsers)
                .HasForeignKey(d => d.SenderUserId)
                .HasConstraintName("FK__Chats__SenderUse__151B244E");
        });

        modelBuilder.Entity<Connection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Connections__3214EC07");

            entity.HasIndex(e => e.ConnectionId, "IX_Connections_ConnectionId");

            entity.Property(e => e.UserId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.UserType).HasMaxLength(10).IsRequired();
            entity.Property(e => e.ConnectionId).HasMaxLength(255).IsRequired();
            entity.Property(e => e.ConnectedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.DeviceInfo).HasMaxLength(500);
            entity.Property(e => e.IpAddress).HasMaxLength(45);
        });

        modelBuilder.Entity<FavoriteHelper>(entity =>
        {
            entity.HasKey(e => e.FavoriteId).HasName("PK__Favorite__CE74FAF57A24D5D8");

            entity
                .HasIndex(e => new { e.UserId, e.HelperId }, "UQ__Favorite__BFAF9A112C485D33")
                .IsUnique();

            entity.Property(e => e.FavoriteId).HasColumnName("FavoriteID");
            entity.Property(e => e.DateAdded).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity
                .HasOne(d => d.Helper)
                .WithMany(p => p.FavoriteHelpers)
                .HasForeignKey(d => d.HelperId)
                .HasConstraintName("FK__FavoriteH__Helpe__08B54D69");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.FavoriteHelpers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__FavoriteH__UserI__07C12930");
        });

        modelBuilder.Entity<Helper>(entity =>
        {
            entity.HasKey(e => e.HelperId).HasName("PK__Helpers__82756BCB49F9326D");

            entity.HasIndex(e => e.PhoneNumber, "UQ__Helpers__85FB4E38545E5842").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Helpers__A9D10534181E5E54").IsUnique();

            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.ApprovalStatus).HasMaxLength(20).HasDefaultValue("Pending");
            entity.Property(e => e.ApprovedByAdminId).HasColumnName("ApprovedByAdminID");
            entity
                .Property(e => e.AverageRating)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(3, 2)");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.IsActive).HasDefaultValue(false);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.ProfilePictureUrl).HasColumnName("ProfilePictureURL");
            entity.Property(e => e.RegistrationDate).HasDefaultValueSql("(getdate())");
            entity
                .Property(e => e.TotalHoursWorked)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(10, 2)");

            entity
                .HasOne(d => d.ApprovedByAdmin)
                .WithMany(p => p.Helpers)
                .HasForeignKey(d => d.ApprovedByAdminId)
                .HasConstraintName("FK__Helpers__Approve__534D60F1");
            entity.Property(e => e.AvailableStatus)
                .HasConversion<int>();
        });

        modelBuilder.Entity<HelperDocument>(entity =>
        {
            entity.HasKey(e => e.DocumentId).HasName("PK__HelperDo__1ABEEF6F8527D9AD");

            entity.Property(e => e.DocumentId).HasColumnName("DocumentID");
            entity.Property(e => e.DocumentType).HasMaxLength(50);
            entity.Property(e => e.DocumentUrl).HasColumnName("DocumentURL");
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.UploadDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.VerificationStatus).HasMaxLength(20).HasDefaultValue("Pending");
            entity.Property(e => e.VerifiedByAdminId).HasColumnName("VerifiedByAdminID");

            entity
                .HasOne(d => d.Helper)
                .WithMany(p => p.HelperDocuments)
                .HasForeignKey(d => d.HelperId)
                .HasConstraintName("FK__HelperDoc__Helpe__5812160E");

            entity
                .HasOne(d => d.VerifiedByAdmin)
                .WithMany(p => p.HelperDocuments)
                .HasForeignKey(d => d.VerifiedByAdminId)
                .HasConstraintName("FK__HelperDoc__Verif__59063A47");
        });

        modelBuilder.Entity<HelperSkill>(entity =>
        {
            entity.HasKey(e => e.HelperSkillId).HasName("PK__HelperSk__22780E111712BBDB");

            entity
                .HasIndex(e => new { e.HelperId, e.ServiceId }, "UQ__HelperSk__3E24D0C48AE971E9")
                .IsUnique();

            entity.Property(e => e.HelperSkillId).HasColumnName("HelperSkillID");
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.IsPrimarySkill).HasDefaultValue(false);
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");

            entity
                .HasOne(d => d.Helper)
                .WithMany(p => p.HelperSkills)
                .HasForeignKey(d => d.HelperId)
                .HasConstraintName("FK__HelperSki__Helpe__6383C8BA");

            entity
                .HasOne(d => d.Service)
                .WithMany(p => p.HelperSkills)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__HelperSki__Servi__6477ECF3");
        });

        modelBuilder.Entity<HelperWallet>(entity =>
        {
            entity.HasKey(e => e.WalletId).HasName("PK__HelperWa__84D4F92ED51955AB");

            entity.HasIndex(e => e.HelperId, "UQ__HelperWa__82756BCA17857ABC").IsUnique();

            entity.Property(e => e.WalletId).HasColumnName("WalletID");
            entity.Property(e => e.Balance).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
            entity
                .Property(e => e.CurrencyCode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasDefaultValue("VND");
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.LastUpdatedTime).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.Helper)
                .WithOne(p => p.HelperWallet)
                .HasForeignKey<HelperWallet>(d => d.HelperId)
                .HasConstraintName("FK__HelperWal__Helpe__2B0A656D");
        });

        modelBuilder.Entity<HelperWorkArea>(entity =>
        {
            entity.HasKey(e => e.WorkAreaId).HasName("PK__HelperWo__70734D65BC1A1AA4");

            entity.Property(e => e.WorkAreaId).HasColumnName("WorkAreaID");
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 7)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10, 7)");
            entity
                .Property(e => e.RadiusKm)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("RadiusKM");
            entity.Property(e => e.Ward).HasMaxLength(100);

            entity
                .HasOne(d => d.Helper)
                .WithMany(p => p.HelperWorkAreas)
                .HasForeignKey(d => d.HelperId)
                .HasConstraintName("FK__HelperWor__Helpe__6754599E");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E323FD91180");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.CreationTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.NotificationType).HasMaxLength(100);
            entity.Property(e => e.RecipientHelperId).HasColumnName("RecipientHelperID");
            entity.Property(e => e.RecipientUserId).HasColumnName("RecipientUserID");
            entity.Property(e => e.ReferenceId).HasMaxLength(255).HasColumnName("ReferenceID");
            entity.Property(e => e.Title).HasMaxLength(255);

            entity
                .HasOne(d => d.RecipientHelper)
                .WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RecipientHelperId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Notificat__Recip__0E6E26BF");

            entity
                .HasOne(d => d.RecipientUser)
                .WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RecipientUserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Notificat__Recip__0D7A0286");
        });

        modelBuilder.Entity<OtpVerification>(entity =>
        {
            entity.HasKey(e => e.OtpId).HasName("PK__OtpVerif__3143C4831984F9C4");

            entity.Property(e => e.OtpId).HasColumnName("OtpID");
            entity.Property(e => e.AttemptCount).HasDefaultValue(0);
            entity.Property(e => e.CreationDateTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Identifier).HasMaxLength(255);
            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.OtpCode).HasMaxLength(10).IsUnicode(false);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A58AEF5F5A4");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.PaymentDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.PaymentStatus).HasMaxLength(20);
            entity.Property(e => e.TransactionId).HasMaxLength(255).HasColumnName("TransactionID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity
                .HasOne(d => d.Booking)
                .WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payments__Bookin__797309D9");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.Payments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payments__UserID__7A672E12");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79AECC26EA7F");

            entity.HasIndex(e => e.BookingId, "UQ__Reviews__73951ACC463E5DF0").IsUnique();

            entity.Property(e => e.ReviewId).HasColumnName("ReviewID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.IsEdited).HasDefaultValue(false);
            entity.Property(e => e.ReviewDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity
                .HasOne(d => d.Booking)
                .WithOne(p => p.Review)
                .HasForeignKey<Review>(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__Booking__01142BA1");

            entity
                .HasOne(d => d.Helper)
                .WithMany(p => p.Reviews)
                .HasForeignKey(d => d.HelperId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__HelperI__02FC7413");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__UserID__02084FDA");

            entity.Navigation(r => r.User).AutoInclude();
            entity.Navigation(r => r.Helper).AutoInclude();
        });

        modelBuilder.Entity<ReviewReport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Reason).IsRequired().HasMaxLength(255);
            entity.Property(e => e.ReportedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(e => e.Review)
                .WithMany()
                .HasForeignKey(e => e.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Helper)
                .WithMany()
                .HasForeignKey(e => e.HelperId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Services__C51BB0EAEB23CFC6");

            entity.HasIndex(e => e.ServiceName, "UQ__Services__A42B5F9910585C13").IsUnique();

            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.BasePrice).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IconUrl).HasColumnName("IconURL");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ParentServiceId).HasColumnName("ParentServiceID");
            entity.Property(e => e.PriceUnit).HasMaxLength(50);
            entity.Property(e => e.ServiceName).HasMaxLength(100);

            entity
                .HasOne(d => d.ParentService)
                .WithMany(p => p.InverseParentService)
                .HasForeignKey(d => d.ParentServiceId)
                .HasConstraintName("FK__Services__Parent__5EBF139D");
        });

        modelBuilder.Entity<ServiceRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__ServiceR__33A8519A5166DDB8");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.AddressId).HasColumnName("AddressID");
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 7)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10, 7)");
            entity.Property(e => e.RequestCreationTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.RequestedDurationHours).HasColumnType("decimal(4, 2)");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity
                .HasOne(d => d.Address)
                .WithMany(p => p.ServiceRequests)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceRe__Addre__6E01572D");

            entity
                .HasOne(d => d.Service)
                .WithMany(p => p.ServiceRequests)
                .HasForeignKey(d => d.ServiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceRe__Servi__6D0D32F4");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.ServiceRequests)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ServiceRe__UserI__6C190EBB");
        });

        modelBuilder.Entity<SupportTicket>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__SupportT__712CC62797206C08");

            entity.Property(e => e.TicketId).HasColumnName("TicketID");
            entity.Property(e => e.AssignedToAdminId).HasColumnName("AssignedToAdminID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CreationTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Priority).HasMaxLength(20).HasDefaultValue("Medium");
            entity.Property(e => e.ReporterHelperId).HasColumnName("ReporterHelperID");
            entity.Property(e => e.ReporterUserId).HasColumnName("ReporterUserID");
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Open");
            entity.Property(e => e.Subject).HasMaxLength(255);

            entity
                .HasOne(d => d.AssignedToAdmin)
                .WithMany(p => p.SupportTickets)
                .HasForeignKey(d => d.AssignedToAdminId)
                .HasConstraintName("FK__SupportTi__Assig__236943A5");

            entity
                .HasOne(d => d.Booking)
                .WithMany(p => p.SupportTickets)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__SupportTi__Booki__22751F6C");

            entity
                .HasOne(d => d.ReporterHelper)
                .WithMany(p => p.SupportTickets)
                .HasForeignKey(d => d.ReporterHelperId)
                .HasConstraintName("FK__SupportTi__Repor__2180FB33");

            entity
                .HasOne(d => d.ReporterUser)
                .WithMany(p => p.SupportTickets)
                .HasForeignKey(d => d.ReporterUserId)
                .HasConstraintName("FK__SupportTi__Repor__208CD6FA");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACBD8A1165");

            entity.HasIndex(e => e.PhoneNumber, "UQ__Users__85FB4E388DCB4BB0").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053446F14E7A").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.DefaultAddressId).HasColumnName("DefaultAddressID");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity
                .Property(e => e.ExternalAuthId)
                .HasMaxLength(255)
                .HasColumnName("ExternalAuthID");
            entity.Property(e => e.ExternalAuthProvider).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.ProfilePictureUrl).HasColumnName("ProfilePictureURL");
            entity.Property(e => e.RegistrationDate).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.DefaultAddress)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.DefaultAddressId)
                .HasConstraintName("FK_Users_DefaultAddress");

            entity.Navigation(u => u.DefaultAddress).AutoInclude();
        });

        modelBuilder.Entity<UserAddress>(entity =>
        {
            entity.HasKey(e => e.AddressId).HasName("PK__UserAddr__091C2A1B6FC387F9");

            entity.Property(e => e.AddressId).HasColumnName("AddressID");
            entity.Property(e => e.AddressLine1).HasMaxLength(255);
            entity.Property(e => e.AddressLine2).HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 7)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10, 7)");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Ward).HasMaxLength(100);

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.UserAddresses)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserAddre__UserI__4316F928");
        });

        modelBuilder.Entity<WalletTransaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__WalletTr__55433A4B07816BD8");

            entity.Property(e => e.TransactionId).HasColumnName("TransactionID");
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity
                .Property(e => e.ReferenceTransactionId)
                .HasMaxLength(255)
                .HasColumnName("ReferenceTransactionID");
            entity.Property(e => e.TransactionDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TransactionType).HasMaxLength(50);
            entity.Property(e => e.WalletId).HasColumnName("WalletID");
            entity.Property(e => e.WithdrawalRequestId).HasColumnName("WithdrawalRequestID");

            entity
                .HasOne(d => d.Booking)
                .WithMany(p => p.WalletTransactions)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__WalletTra__Booki__2FCF1A8A");

            entity
                .HasOne(d => d.Wallet)
                .WithMany(p => p.WalletTransactions)
                .HasForeignKey(d => d.WalletId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WalletTra__Walle__2EDAF651");

            entity
                .HasOne(d => d.WithdrawalRequest)
                .WithMany(p => p.WalletTransactions)
                .HasForeignKey(d => d.WithdrawalRequestId)
                .HasConstraintName("FK_WalletTransactions_WithdrawalRequest");
        });

        modelBuilder.Entity<WithdrawalRequest>(entity =>
        {
            entity.HasKey(e => e.WithdrawalRequestId).HasName("PK__Withdraw__FD8AA1D2B1E8B480");

            entity.Property(e => e.WithdrawalRequestId).HasColumnName("WithdrawalRequestID");
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity
                .Property(e => e.BankTransactionId)
                .HasMaxLength(255)
                .HasColumnName("BankTransactionID");
            entity.Property(e => e.HelperId).HasColumnName("HelperID");
            entity.Property(e => e.ProcessedByAdminId).HasColumnName("ProcessedByAdminID");
            entity.Property(e => e.RequestDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.RequestMethod).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
            entity.Property(e => e.WalletId).HasColumnName("WalletID");

            entity
                .HasOne(d => d.Helper)
                .WithMany(p => p.WithdrawalRequests)
                .HasForeignKey(d => d.HelperId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Withdrawa__Helpe__3587F3E0");

            entity
                .HasOne(d => d.ProcessedByAdmin)
                .WithMany(p => p.WithdrawalRequests)
                .HasForeignKey(d => d.ProcessedByAdminId)
                .HasConstraintName("FK__Withdrawa__Proce__37703C52");

            entity
                .HasOne(d => d.Wallet)
                .WithMany(p => p.WithdrawalRequests)
                .HasForeignKey(d => d.WalletId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Withdrawa__Walle__367C1819");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}