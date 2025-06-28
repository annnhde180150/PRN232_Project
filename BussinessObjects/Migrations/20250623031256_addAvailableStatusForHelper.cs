using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BussinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class addAvailableStatusForHelper : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AvailableStatus",
                table: "Helpers",
                type: "int",
                nullable: false,
                defaultValue: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableStatus",
                table: "Helpers");
        }
    }
}
