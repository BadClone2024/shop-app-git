// Services/TokenBlacklistService.cs
using System.Collections.Generic;

public class TokenBlacklistService
{
    private static readonly HashSet<string> BlacklistedTokens = new();

    public void BlacklistToken(string token)
    {
        BlacklistedTokens.Add(token);
    }

    public bool IsTokenBlacklisted(string token)
    {
        return BlacklistedTokens.Contains(token);
    }
}