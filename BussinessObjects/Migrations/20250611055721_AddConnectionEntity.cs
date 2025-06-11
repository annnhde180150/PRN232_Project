using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class AddConnectionEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminUsers",
                columns: table => new
                {
                    AdminID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AdminUse__719FE4E8FCCE94E0", x => x.AdminID);
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserType = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ConnectionId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ConnectedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    DisconnectedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DeviceInfo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IpAddress = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Connections__3214EC07", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OtpVerifications",
                columns: table => new
                {
                    OtpID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Identifier = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    OtpCode = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    ExpiryDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    AttemptCount = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    CreationDateTime = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OtpVerif__3143C4831984F9C4", x => x.OtpID);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IconURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BasePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true, defaultValue: 0m),
                    PriceUnit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    ParentServiceID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Services__C51BB0EAEB23CFC6", x => x.ServiceID);
                    table.ForeignKey(
                        name: "FK__Services__Parent__5EBF139D",
                        column: x => x.ParentServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateTable(
                name: "Helpers",
                columns: table => new
                {
                    HelperID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ProfilePictureURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    ApprovalStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Pending"),
                    ApprovedByAdminID = table.Column<int>(type: "int", nullable: true),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    TotalHoursWorked = table.Column<decimal>(type: "decimal(10,2)", nullable: true, defaultValue: 0m),
                    AverageRating = table.Column<decimal>(type: "decimal(3,2)", nullable: true, defaultValue: 0m),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Helpers__82756BCB49F9326D", x => x.HelperID);
                    table.ForeignKey(
                        name: "FK__Helpers__Approve__534D60F1",
                        column: x => x.ApprovedByAdminID,
                        principalTable: "AdminUsers",
                        principalColumn: "AdminID");
                });

            migrationBuilder.CreateTable(
                name: "HelperDocuments",
                columns: table => new
                {
                    DocumentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DocumentURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    VerificationStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Pending"),
                    VerifiedByAdminID = table.Column<int>(type: "int", nullable: true),
                    VerificationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__HelperDo__1ABEEF6F8527D9AD", x => x.DocumentID);
                    table.ForeignKey(
                        name: "FK__HelperDoc__Helpe__5812160E",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__HelperDoc__Verif__59063A47",
                        column: x => x.VerifiedByAdminID,
                        principalTable: "AdminUsers",
                        principalColumn: "AdminID");
                });

            migrationBuilder.CreateTable(
                name: "HelperSkills",
                columns: table => new
                {
                    HelperSkillID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: true),
                    IsPrimarySkill = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__HelperSk__22780E111712BBDB", x => x.HelperSkillID);
                    table.ForeignKey(
                        name: "FK__HelperSki__Helpe__6383C8BA",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__HelperSki__Servi__6477ECF3",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HelperWallets",
                columns: table => new
                {
                    WalletID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    Balance = table.Column<decimal>(type: "decimal(18,2)", nullable: true, defaultValue: 0m),
                    LastUpdatedTime = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    CurrencyCode = table.Column<string>(type: "varchar(3)", unicode: false, maxLength: 3, nullable: true, defaultValue: "VND")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__HelperWa__84D4F92ED51955AB", x => x.WalletID);
                    table.ForeignKey(
                        name: "FK__HelperWal__Helpe__2B0A656D",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HelperWorkAreas",
                columns: table => new
                {
                    WorkAreaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    District = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(10,7)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(10,7)", nullable: true),
                    RadiusKM = table.Column<decimal>(type: "decimal(5,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__HelperWo__70734D65BC1A1AA4", x => x.WorkAreaID);
                    table.ForeignKey(
                        name: "FK__HelperWor__Helpe__6754599E",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WithdrawalRequests",
                columns: table => new
                {
                    WithdrawalRequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    WalletID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RequestMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AccountDetails = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "Pending"),
                    ProcessedByAdminID = table.Column<int>(type: "int", nullable: true),
                    ProcessingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankTransactionID = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Withdraw__FD8AA1D2B1E8B480", x => x.WithdrawalRequestID);
                    table.ForeignKey(
                        name: "FK__Withdrawa__Helpe__3587F3E0",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID");
                    table.ForeignKey(
                        name: "FK__Withdrawa__Proce__37703C52",
                        column: x => x.ProcessedByAdminID,
                        principalTable: "AdminUsers",
                        principalColumn: "AdminID");
                    table.ForeignKey(
                        name: "FK__Withdrawa__Walle__367C1819",
                        column: x => x.WalletID,
                        principalTable: "HelperWallets",
                        principalColumn: "WalletID");
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    BookingID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false),
                    AddressID = table.Column<int>(type: "int", nullable: false),
                    ScheduledStartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScheduledEndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActualStartTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualEndTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SpecialNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CancellationReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CancelledBy = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    CancellationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FreeCancellationDeadline = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EstimatedPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    FinalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    BookingCreationTime = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Bookings__73951ACD92FB321F", x => x.BookingID);
                    table.ForeignKey(
                        name: "FK__Bookings__Helper__73BA3083",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID");
                    table.ForeignKey(
                        name: "FK__Bookings__Servic__74AE54BC",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateTable(
                name: "WalletTransactions",
                columns: table => new
                {
                    TransactionID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WalletID = table.Column<int>(type: "int", nullable: false),
                    BookingID = table.Column<int>(type: "int", nullable: true),
                    WithdrawalRequestID = table.Column<int>(type: "int", nullable: true),
                    TransactionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReferenceTransactionID = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__WalletTr__55433A4B07816BD8", x => x.TransactionID);
                    table.ForeignKey(
                        name: "FK_WalletTransactions_WithdrawalRequest",
                        column: x => x.WithdrawalRequestID,
                        principalTable: "WithdrawalRequests",
                        principalColumn: "WithdrawalRequestID");
                    table.ForeignKey(
                        name: "FK__WalletTra__Booki__2FCF1A8A",
                        column: x => x.BookingID,
                        principalTable: "Bookings",
                        principalColumn: "BookingID");
                    table.ForeignKey(
                        name: "FK__WalletTra__Walle__2EDAF651",
                        column: x => x.WalletID,
                        principalTable: "HelperWallets",
                        principalColumn: "WalletID");
                });

            migrationBuilder.CreateTable(
                name: "Chats",
                columns: table => new
                {
                    ChatID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingID = table.Column<int>(type: "int", nullable: true),
                    SenderUserID = table.Column<int>(type: "int", nullable: true),
                    SenderHelperID = table.Column<int>(type: "int", nullable: true),
                    ReceiverUserID = table.Column<int>(type: "int", nullable: true),
                    ReceiverHelperID = table.Column<int>(type: "int", nullable: true),
                    MessageContent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    IsReadByReceiver = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    ReadTimestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsModerated = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    ModeratorAdminID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Chats__A9FBE6264EF27BF8", x => x.ChatID);
                    table.ForeignKey(
                        name: "FK__Chats__BookingID__14270015",
                        column: x => x.BookingID,
                        principalTable: "Bookings",
                        principalColumn: "BookingID");
                    table.ForeignKey(
                        name: "FK__Chats__Moderator__18EBB532",
                        column: x => x.ModeratorAdminID,
                        principalTable: "AdminUsers",
                        principalColumn: "AdminID");
                    table.ForeignKey(
                        name: "FK__Chats__ReceiverH__17F790F9",
                        column: x => x.ReceiverHelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID");
                    table.ForeignKey(
                        name: "FK__Chats__SenderHel__160F4887",
                        column: x => x.SenderHelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID");
                });

            migrationBuilder.CreateTable(
                name: "FavoriteHelpers",
                columns: table => new
                {
                    FavoriteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    DateAdded = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Favorite__CE74FAF57A24D5D8", x => x.FavoriteID);
                    table.ForeignKey(
                        name: "FK__FavoriteH__Helpe__08B54D69",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    NotificationID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecipientUserID = table.Column<int>(type: "int", nullable: true),
                    RecipientHelperID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NotificationType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ReferenceID = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsRead = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    ReadTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    SentTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Notifica__20CF2E323FD91180", x => x.NotificationID);
                    table.ForeignKey(
                        name: "FK__Notificat__Recip__0E6E26BF",
                        column: x => x.RecipientHelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TransactionID = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PaymentStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    PaymentGatewayResponse = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payments__9B556A58AEF5F5A4", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK__Payments__Bookin__797309D9",
                        column: x => x.BookingID,
                        principalTable: "Bookings",
                        principalColumn: "BookingID");
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    ReviewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    HelperID = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReviewDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    IsEdited = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    LastEditedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Reviews__74BC79AECC26EA7F", x => x.ReviewID);
                    table.ForeignKey(
                        name: "FK__Reviews__Booking__01142BA1",
                        column: x => x.BookingID,
                        principalTable: "Bookings",
                        principalColumn: "BookingID");
                    table.ForeignKey(
                        name: "FK__Reviews__HelperI__02FC7413",
                        column: x => x.HelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID");
                });

            migrationBuilder.CreateTable(
                name: "ServiceRequests",
                columns: table => new
                {
                    RequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false),
                    AddressID = table.Column<int>(type: "int", nullable: false),
                    RequestedStartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RequestedDurationHours = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    SpecialNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "Pending"),
                    RequestCreationTime = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    Latitude = table.Column<decimal>(type: "decimal(10,7)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(10,7)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ServiceR__33A8519A5166DDB8", x => x.RequestID);
                    table.ForeignKey(
                        name: "FK__ServiceRe__Servi__6D0D32F4",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateTable(
                name: "SupportTickets",
                columns: table => new
                {
                    TicketID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReporterUserID = table.Column<int>(type: "int", nullable: true),
                    ReporterHelperID = table.Column<int>(type: "int", nullable: true),
                    BookingID = table.Column<int>(type: "int", nullable: true),
                    Subject = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "Open"),
                    Priority = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Medium"),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    LastUpdateTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ResolvedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AssignedToAdminID = table.Column<int>(type: "int", nullable: true),
                    ResolutionNotes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SupportT__712CC62797206C08", x => x.TicketID);
                    table.ForeignKey(
                        name: "FK__SupportTi__Assig__236943A5",
                        column: x => x.AssignedToAdminID,
                        principalTable: "AdminUsers",
                        principalColumn: "AdminID");
                    table.ForeignKey(
                        name: "FK__SupportTi__Booki__22751F6C",
                        column: x => x.BookingID,
                        principalTable: "Bookings",
                        principalColumn: "BookingID");
                    table.ForeignKey(
                        name: "FK__SupportTi__Repor__2180FB33",
                        column: x => x.ReporterHelperID,
                        principalTable: "Helpers",
                        principalColumn: "HelperID");
                });

            migrationBuilder.CreateTable(
                name: "UserAddresses",
                columns: table => new
                {
                    AddressID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    AddressLine1 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AddressLine2 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Ward = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    District = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FullAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(10,7)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(10,7)", nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserAddr__091C2A1B6FC387F9", x => x.AddressID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProfilePictureURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExternalAuthProvider = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ExternalAuthID = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    DefaultAddressID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CCACBD8A1165", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_Users_DefaultAddress",
                        column: x => x.DefaultAddressID,
                        principalTable: "UserAddresses",
                        principalColumn: "AddressID");
                });

            migrationBuilder.CreateIndex(
                name: "UQ__AdminUse__536C85E49000CC47",
                table: "AdminUsers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__AdminUse__A9D10534D4CE2C9E",
                table: "AdminUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_AddressID",
                table: "Bookings",
                column: "AddressID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_HelperID",
                table: "Bookings",
                column: "HelperID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_RequestID",
                table: "Bookings",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ServiceID",
                table: "Bookings",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserID",
                table: "Bookings",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_BookingID",
                table: "Chats",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_ModeratorAdminID",
                table: "Chats",
                column: "ModeratorAdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_ReceiverHelperID",
                table: "Chats",
                column: "ReceiverHelperID");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_ReceiverUserID",
                table: "Chats",
                column: "ReceiverUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_SenderHelperID",
                table: "Chats",
                column: "SenderHelperID");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_SenderUserID",
                table: "Chats",
                column: "SenderUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ConnectionId",
                table: "Connections",
                column: "ConnectionId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteHelpers_HelperID",
                table: "FavoriteHelpers",
                column: "HelperID");

            migrationBuilder.CreateIndex(
                name: "UQ__Favorite__BFAF9A112C485D33",
                table: "FavoriteHelpers",
                columns: new[] { "UserID", "HelperID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HelperDocuments_HelperID",
                table: "HelperDocuments",
                column: "HelperID");

            migrationBuilder.CreateIndex(
                name: "IX_HelperDocuments_VerifiedByAdminID",
                table: "HelperDocuments",
                column: "VerifiedByAdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Helpers_ApprovedByAdminID",
                table: "Helpers",
                column: "ApprovedByAdminID");

            migrationBuilder.CreateIndex(
                name: "UQ__Helpers__85FB4E38545E5842",
                table: "Helpers",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Helpers__A9D10534181E5E54",
                table: "Helpers",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_HelperSkills_ServiceID",
                table: "HelperSkills",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "UQ__HelperSk__3E24D0C48AE971E9",
                table: "HelperSkills",
                columns: new[] { "HelperID", "ServiceID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__HelperWa__82756BCA17857ABC",
                table: "HelperWallets",
                column: "HelperID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HelperWorkAreas_HelperID",
                table: "HelperWorkAreas",
                column: "HelperID");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_RecipientHelperID",
                table: "Notifications",
                column: "RecipientHelperID");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_RecipientUserID",
                table: "Notifications",
                column: "RecipientUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BookingID",
                table: "Payments",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_UserID",
                table: "Payments",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_HelperID",
                table: "Reviews",
                column: "HelperID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserID",
                table: "Reviews",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "UQ__Reviews__73951ACC463E5DF0",
                table: "Reviews",
                column: "BookingID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_AddressID",
                table: "ServiceRequests",
                column: "AddressID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_ServiceID",
                table: "ServiceRequests",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_UserID",
                table: "ServiceRequests",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Services_ParentServiceID",
                table: "Services",
                column: "ParentServiceID");

            migrationBuilder.CreateIndex(
                name: "UQ__Services__A42B5F9910585C13",
                table: "Services",
                column: "ServiceName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SupportTickets_AssignedToAdminID",
                table: "SupportTickets",
                column: "AssignedToAdminID");

            migrationBuilder.CreateIndex(
                name: "IX_SupportTickets_BookingID",
                table: "SupportTickets",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_SupportTickets_ReporterHelperID",
                table: "SupportTickets",
                column: "ReporterHelperID");

            migrationBuilder.CreateIndex(
                name: "IX_SupportTickets_ReporterUserID",
                table: "SupportTickets",
                column: "ReporterUserID");

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_UserID",
                table: "UserAddresses",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DefaultAddressID",
                table: "Users",
                column: "DefaultAddressID");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__85FB4E388DCB4BB0",
                table: "Users",
                column: "PhoneNumber",
                unique: true,
                filter: "[PhoneNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__A9D1053446F14E7A",
                table: "Users",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_WalletTransactions_BookingID",
                table: "WalletTransactions",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_WalletTransactions_WalletID",
                table: "WalletTransactions",
                column: "WalletID");

            migrationBuilder.CreateIndex(
                name: "IX_WalletTransactions_WithdrawalRequestID",
                table: "WalletTransactions",
                column: "WithdrawalRequestID");

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawalRequests_HelperID",
                table: "WithdrawalRequests",
                column: "HelperID");

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawalRequests_ProcessedByAdminID",
                table: "WithdrawalRequests",
                column: "ProcessedByAdminID");

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawalRequests_WalletID",
                table: "WithdrawalRequests",
                column: "WalletID");

            migrationBuilder.AddForeignKey(
                name: "FK__Bookings__Addres__75A278F5",
                table: "Bookings",
                column: "AddressID",
                principalTable: "UserAddresses",
                principalColumn: "AddressID");

            migrationBuilder.AddForeignKey(
                name: "FK__Bookings__Reques__71D1E811",
                table: "Bookings",
                column: "RequestID",
                principalTable: "ServiceRequests",
                principalColumn: "RequestID");

            migrationBuilder.AddForeignKey(
                name: "FK__Bookings__UserID__72C60C4A",
                table: "Bookings",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK__Chats__ReceiverU__17036CC0",
                table: "Chats",
                column: "ReceiverUserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK__Chats__SenderUse__151B244E",
                table: "Chats",
                column: "SenderUserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK__FavoriteH__UserI__07C12930",
                table: "FavoriteHelpers",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__Notificat__Recip__0D7A0286",
                table: "Notifications",
                column: "RecipientUserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__Payments__UserID__7A672E12",
                table: "Payments",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK__Reviews__UserID__02084FDA",
                table: "Reviews",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK__ServiceRe__Addre__6E01572D",
                table: "ServiceRequests",
                column: "AddressID",
                principalTable: "UserAddresses",
                principalColumn: "AddressID");

            migrationBuilder.AddForeignKey(
                name: "FK__ServiceRe__UserI__6C190EBB",
                table: "ServiceRequests",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__SupportTi__Repor__208CD6FA",
                table: "SupportTickets",
                column: "ReporterUserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK__UserAddre__UserI__4316F928",
                table: "UserAddresses",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_DefaultAddress",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Chats");

            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "FavoriteHelpers");

            migrationBuilder.DropTable(
                name: "HelperDocuments");

            migrationBuilder.DropTable(
                name: "HelperSkills");

            migrationBuilder.DropTable(
                name: "HelperWorkAreas");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "OtpVerifications");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "SupportTickets");

            migrationBuilder.DropTable(
                name: "WalletTransactions");

            migrationBuilder.DropTable(
                name: "WithdrawalRequests");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "HelperWallets");

            migrationBuilder.DropTable(
                name: "ServiceRequests");

            migrationBuilder.DropTable(
                name: "Helpers");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "AdminUsers");

            migrationBuilder.DropTable(
                name: "UserAddresses");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
