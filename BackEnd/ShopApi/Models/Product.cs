using System;
using System.ComponentModel.DataAnnotations;

public class Product
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue)]
    public int Price { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int InStock { get; set; }
    
    [Required]
    [Url]  
    public string ImgUrl { get; set; }
}