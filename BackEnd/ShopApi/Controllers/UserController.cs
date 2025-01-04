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
    private readonly UserQueries _userQueries;
    private readonly ILogger<UserController> _logger;

    public UserController(
        UserQueries userQueries,
        ILogger<UserController> logger)
    {
        _userQueries = userQueries;
        _logger = logger;
    }

    // Create

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(UserDto userDto)
    {
        if (await _userQueries.EmailExistsAsync(userDto.Email))
            return BadRequest("Email already exists");

        if (await _userQueries.UsernameExistsAsync(userDto.Username))
            return BadRequest("Username already exists");

        var user = await _userQueries.CreateUserAsync(userDto);
        var token = _userQueries.GenerateJwtToken(user);

        return Ok(new { token, user });
    }

    // Find by ID


    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _userQueries.GetUserByIdAsync(id);
        if (user == null)
            return NotFound();
        return user;
    }

    // Get all users


    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _userQueries.GetAllUsersAsync();
    }

    // Update user


    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UserUpdateDto userDto)
    {
        var user = await _userQueries.UpdateUserAsync(id, userDto);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // Delete user


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var success = await _userQueries.DeleteUserAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }

    // Login

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(LoginDto loginDto)
    {
        var user = await _userQueries.GetUserByEmailAsync(loginDto.Email);
        if (user == null)
            return Unauthorized("Invalid credentials");

        var hashedPassword = _userQueries.HashPassword(loginDto.Password);
        if (hashedPassword != user.PasswordHash)
            return Unauthorized("Invalid credentials");

        var token = _userQueries.GenerateJwtToken(user);
        return Ok(new { token, user });
    }

    // Logout

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        try
        {
            var token = HttpContext.Request.Headers["Authorization"]
                .ToString().Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                return Ok(new { message = "The token was deleted from the local storage", succesfull = true });
            }

            return BadRequest(new { message = "No token provided", succesfull = false });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error during logout: {ex.Message}");
            return StatusCode(500, new { message = "Error processing logout", succesfull = false });
        }
    }
}