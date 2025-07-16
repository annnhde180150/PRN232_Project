using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class addServiceUsertoBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceID",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "UserID",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ServiceID",
                table: "Bookings",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserID",
                table: "Bookings",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Services_ServiceID",
                table: "Bookings",
                column: "ServiceID",
                principalTable: "Services",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users_UserID",
                table: "Bookings",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Services_ServiceID",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users_UserID",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_ServiceID",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserID",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "ServiceID",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Bookings");
        }
    }
}
