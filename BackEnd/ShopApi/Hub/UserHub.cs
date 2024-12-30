//using Microsoft.AspNetCore.SignalR;
//using System.Collections.Concurrent;
//using System.IdentityModel.Tokens.Jwt;
//using System.Linq;
//using Microsoft.AspNetCore.Http.Connections;

using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.Http.Connections;

public class UserHub : Hub
{
    private static readonly ConcurrentDictionary<string, string> OnlineUsers = new();

    public override async Task OnConnectedAsync()
    {
        var accessToken = Context.GetHttpContext()?.Request.Query["access_token"].ToString();
        Console.WriteLine($"\nHub received token: {accessToken}");

        var userId = GetUserIdFromToken(accessToken);

        if (!string.IsNullOrEmpty(userId))
        {
            OnlineUsers.TryAdd(Context.ConnectionId, userId);
            await Clients.Others.SendAsync("UserConnected", userId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine("on disconnected asyncs");

        if (OnlineUsers.TryRemove(Context.ConnectionId, out string? userId))
        {
            // Only notify if this was the user's last connection
            if (!OnlineUsers.Values.Contains(userId))
            {
                await Clients.Others.SendAsync("UserDisconnected", userId);
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    public Task<List<string>> GetOnlineUsers()
    {
        var users = OnlineUsers.Values.Distinct().ToList();
        Console.WriteLine("Online Users List:");
        Console.WriteLine($"Total users: {users.Count}");
        Console.WriteLine("Users:");
        foreach (var user in users)
        {
            Console.WriteLine($"- User ID: {user}");
        }
        Console.WriteLine("------------------------");

        return Task.FromResult(users);
    }

    // You'll need to implement this
    private string? GetUserIdFromToken(string? token)
    {
        Console.WriteLine("get user id from token: ");

        if (string.IsNullOrEmpty(token)) return null;

        try
        {
            token = token.Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            Console.WriteLine(jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value);

            return jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;  // Changed from "sub" to "nameid"
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing token: {ex.Message}");
            return null;
        }
    }
}