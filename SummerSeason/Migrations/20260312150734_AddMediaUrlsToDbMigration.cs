using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SummerSeason.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaUrlsToDbMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Leagues",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "Leagues",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Challenges",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "Challenges",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Leagues");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "Leagues");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "Challenges");
        }
    }
}
