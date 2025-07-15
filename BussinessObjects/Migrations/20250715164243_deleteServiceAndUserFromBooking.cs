using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class deleteServiceAndUserFromBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Services_ServiceId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_UserAddresses_UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users_UserId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_ServiceId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Bookings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserAddressAddressId",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ServiceId",
                table: "Bookings",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserAddressAddressId",
                table: "Bookings",
                column: "UserAddressAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Services_ServiceId",
                table: "Bookings",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_UserAddresses_UserAddressAddressId",
                table: "Bookings",
                column: "UserAddressAddressId",
                principalTable: "UserAddresses",
                principalColumn: "AddressID");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users_UserId",
                table: "Bookings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserID");
        }
    }
}
