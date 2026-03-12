using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SummerSeason.Migrations
{
    /// <inheritdoc />
    public partial class ChallengeMultiLeague : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Challenges_Leagues_LeagueId",
                table: "Challenges");

            migrationBuilder.DropIndex(
                name: "IX_Challenges_LeagueId",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "LeagueId",
                table: "Challenges");

            migrationBuilder.CreateTable(
                name: "ChallengeLeagues",
                columns: table => new
                {
                    ChallengesId = table.Column<int>(type: "int", nullable: false),
                    LeaguesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengeLeagues", x => new { x.ChallengesId, x.LeaguesId });
                    table.ForeignKey(
                        name: "FK_ChallengeLeagues_Challenges_ChallengesId",
                        column: x => x.ChallengesId,
                        principalTable: "Challenges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChallengeLeagues_Leagues_LeaguesId",
                        column: x => x.LeaguesId,
                        principalTable: "Leagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeLeagues_LeaguesId",
                table: "ChallengeLeagues",
                column: "LeaguesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChallengeLeagues");

            migrationBuilder.AddColumn<int>(
                name: "LeagueId",
                table: "Challenges",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Challenges_LeagueId",
                table: "Challenges",
                column: "LeagueId");

            migrationBuilder.AddForeignKey(
                name: "FK_Challenges_Leagues_LeagueId",
                table: "Challenges",
                column: "LeagueId",
                principalTable: "Leagues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
