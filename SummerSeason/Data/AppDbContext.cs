using Microsoft.EntityFrameworkCore;
using SummerSeason.models;
using SummerSeason.Enums;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;



namespace SummerSeason.data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<League> Leagues { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<Result> Results { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            

            modelBuilder.Entity<User>()
            .Property(u => u.Roles)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => Enum.Parse<UserType>(x))
                    .ToList()
            )
            .Metadata
            .SetValueComparer(new ValueComparer<List<UserType>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList()
            ));

            modelBuilder.Entity<League>()
                .HasOne(l => l.LeagueAdmin)
                .WithMany(u => u.AdminLeagues)
                .HasForeignKey(l => l.LeagueAdminId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<League>()
                .HasMany(l => l.Users)
                .WithMany(u => u.Leagues)
                .UsingEntity(j => j.ToTable("UserLeagues")); 

            modelBuilder.Entity<Challenge>()
                .HasMany(c => c.Leagues)        // navigation property plurale
                .WithMany(l => l.Challenges)
                .UsingEntity(j => j.ToTable("ChallengeLeagues"));

            modelBuilder.Entity<Result>()
                .HasOne(r => r.User)
                .WithMany(u => u.Results)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Result>()
                .HasOne(r => r.Challenge)
                .WithMany(c => c.Results)
                .HasForeignKey(r => r.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);
        
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(nameof(BaseEntity.CreatedAt))
                        .HasColumnType("DATETIME")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");
                }
            }
            var dateOnlyConverter = new ValueConverter<DateOnly, DateTime>(
                d => d.ToDateTime(TimeOnly.MinValue),
                d => DateOnly.FromDateTime(d)
            );

            modelBuilder.Entity<League>()
            .Property(e => e.CreationDate)
            .HasConversion(dateOnlyConverter);
        }
        
    }
}

