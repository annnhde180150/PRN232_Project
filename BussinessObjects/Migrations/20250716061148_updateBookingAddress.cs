using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class updateBookingAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_UserAddresses_UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK__Bookings__Servic__74AE54BC",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK__Bookings__UserID__72C60C4A",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserAddressAddressId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserAddressAddressId",
                table: "Bookings");

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

            migrationBuilder.AddColumn<int>(
                name: "UserAddressAddressId",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserAddressAddressId",
                table: "Bookings",
                column: "UserAddressAddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_UserAddresses_UserAddressAddressId",
                table: "Bookings",
                column: "UserAddressAddressId",
                principalTable: "UserAddresses",
                principalColumn: "AddressID");

            migrationBuilder.AddForeignKey(
                name: "FK__Bookings__Servic__74AE54BC",
                table: "Bookings",
                column: "ServiceID",
                principalTable: "Services",
                principalColumn: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK__Bookings__UserID__72C60C4A",
                table: "Bookings",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID");
        }
    }
}
