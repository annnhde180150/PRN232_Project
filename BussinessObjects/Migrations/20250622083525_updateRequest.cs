using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class updateRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HelperId",
                table: "ServiceRequests",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_HelperId",
                table: "ServiceRequests",
                column: "HelperId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequests_Helpers_HelperId",
                table: "ServiceRequests",
                column: "HelperId",
                principalTable: "Helpers",
                principalColumn: "HelperID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequests_Helpers_HelperId",
                table: "ServiceRequests");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequests_HelperId",
                table: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "HelperId",
                table: "ServiceRequests");
        }
    }
}
