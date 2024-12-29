namespace YourProjectName.DTOs
{
	public class UserDto
	{
		public required string Username { get; set; }
		public required string Email { get; set; }
		public required string Password { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? PhoneNumber { get; set; }
	}

	public class UserUpdateDto
	{
		public string? Username { get; set; }
		public string? Email { get; set; }
		public string? Password { get; set; }  // Add this line
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? PhoneNumber { get; set; }
	}

	public class LoginDto
	{
		public required string Email { get; set; }
		public required string Password { get; set; }
	}
}