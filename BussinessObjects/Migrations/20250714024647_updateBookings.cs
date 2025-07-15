using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class updateBookings : Migration
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

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserAddressAddressId",
                table: "Bookings",
                column: "UserAddressAddressId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_UserAddresses_UserAddressAddressId",
                table: "Bookings");

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
