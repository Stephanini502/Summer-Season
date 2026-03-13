namespace SummerSeason.Services;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;


public class MediaService
{
    private readonly Cloudinary _cloudinary;
    private readonly AppDbContext _context;

    public MediaService(Cloudinary cloudinary, AppDbContext context)
    {
        _cloudinary = cloudinary;
        _context = context;
    }

    public async Task<Media> UploadAndSaveAsync(IFormFile file, string mediaType, int? leagueId, int? challengeId, string folder)
    {
        using var stream = file.OpenReadStream();

        string url;
        string publicId;

        if (mediaType == "image")
        {
            var result = await _cloudinary.UploadAsync(new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder
            });
            url = result.SecureUrl.ToString();
            publicId = result.PublicId;
        }
        else
        {
            var result = await _cloudinary.UploadAsync(new VideoUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder
            });
            url = result.SecureUrl.ToString();
            publicId = result.PublicId;
        }

        var media = new Media
        {
            Url = url,
            Type = mediaType,
            PublicId = publicId,
            LeagueId = leagueId,
            ChallengeId = challengeId
        };

        await _context.Media.AddAsync(media);
        await _context.SaveChangesAsync();

        return media;
    }

    public async Task DeleteAsync(int mediaId)
    {
        var media = await _context.Media.FindAsync(mediaId);
        if (media == null) return;

        if (!string.IsNullOrEmpty(media.PublicId))
            await _cloudinary.DestroyAsync(new DeletionParams(media.PublicId));

        media.DeletedAt = DateTime.Now;
        await _context.SaveChangesAsync();
    }

    public async Task<List<Media>> GetByLeagueAsync(int leagueId)
    {
        return await _context.Media
            .Where(m => m.LeagueId == leagueId && m.DeletedAt == default(DateTime))
            .ToListAsync();
    }
}