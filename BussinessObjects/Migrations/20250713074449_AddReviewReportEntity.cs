using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewReportEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Bookings__Addres__75A278F5",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_AddressID",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "AddressID",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "SpecialNotes",
                table: "Bookings");

            migrationBuilder.AddColumn<int>(
                name: "UserAddressAddressId",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ReviewReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReviewId = table.Column<int>(type: "int", nullable: false),
                    HelperId = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ReportedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReviewReports_Helpers_HelperId",
                        column: x => x.HelperId,
                        principalTable: "Helpers",
                        principalColumn: "HelperID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReviewReports_Reviews_ReviewId",
                        column: x => x.ReviewId,
                        principalTable: "Reviews",
                        principalColumn: "ReviewID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserAddressAddressId",
                table: "Bookings",
                column: "UserAddressAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewReports_HelperId",
                table: "ReviewReports",
                column: "HelperId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewReports_ReviewId",
                table: "ReviewReports",
                column: "ReviewId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_UserAddresses_UserAddressAddressId",
                table: "Bookings",
                column: "UserAddressAddressId",
                principalTable: "UserAddresses",
                principalColumn: "AddressID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_UserAddresses_UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "ReviewReports");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.AddColumn<int>(
                name: "AddressID",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SpecialNotes",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_AddressID",
                table: "Bookings",
                column: "AddressID");

            migrationBuilder.AddForeignKey(
                name: "FK__Bookings__Addres__75A278F5",
                table: "Bookings",
                column: "AddressID",
                principalTable: "UserAddresses",
                principalColumn: "AddressID");
        }
    }
}
