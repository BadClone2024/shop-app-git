using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using YourProjectName.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserController> _logger;
    private readonly TokenBlacklistService _blacklistService;


    public UserController(
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<UserController> logger,
        TokenBlacklistService blacklistService
        )
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _blacklistService = blacklistService;
    }

    // create

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(UserDto userDto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            return BadRequest("Email already exists");

        if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
            return BadRequest("Username already exists");

        var user = new User
        {
            Username = userDto.Username,
            Email = userDto.Email,
            PasswordHash = HashPassword(userDto.Password),
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            PhoneNumber = userDto.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Role = userDto.Password == "Admin2050" ? "Admin" : "User",
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        var token = GenerateJwtToken(user);

        return Ok(new { token, user });

    }

    // get

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();
        return user;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    //update

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UserUpdateDto userDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        if (!string.IsNullOrEmpty(userDto.Email) && userDto.Email != user.Email)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
                return BadRequest("Email already exists");
            user.Email = userDto.Email;
        }

        if (!string.IsNullOrEmpty(userDto.Username) && userDto.Username != user.Username)
        {
            if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
                return BadRequest("Username already exists");
            user.Username = userDto.Username;
        }

        user.FirstName = userDto.FirstName ?? user.FirstName;
        user.LastName = userDto.LastName ?? user.LastName;
        user.PhoneNumber = userDto.PhoneNumber ?? user.PhoneNumber;
        user.Role = userDto.Password == "Admin2050" ? "Admin" : user.Role;
        user.UpdatedAt = DateTime.UtcNow;

        _logger.LogInformation("Llllllllllllllllllllloooooooooooooooooooooonnnnnnnnnnnnngggggggggggg" + "\n" + _configuration["JWT:ValidIssuer"]);

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    // delete

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    //login

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(LoginDto loginDto)
    {
        var user = await _context.Users
            .SingleOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
            return Unauthorized("Invalid credentials");

        var hashedPassword = HashPassword(loginDto.Password);
        if (hashedPassword != user.PasswordHash)
            return Unauthorized("Invalid credentials");

        var token = GenerateJwtToken(user);
        return Ok(new { token, user });
    }

    // password

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    // jwt token

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        }),
            Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:TokenValidityInMinutes"])),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["JWT:ValidIssuer"],     
            Audience = _configuration["JWT:ValidAudience"]  
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    private static readonly HashSet<string> _tokenBlacklist = new();

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        try
        {
            var token = HttpContext.Request.Headers["Authorization"]
                .ToString().Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                _blacklistService.BlacklistToken(token);
                return Ok(new { message = "Logged out successfully" });
            }

            return BadRequest(new { message = "No token provided" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error during logout: {ex.Message}");
            return StatusCode(500, new { message = "Error processing logout" });
        }
    }
}