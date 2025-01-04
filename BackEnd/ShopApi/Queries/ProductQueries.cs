// ProductQueries.cs
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ProductQueries
{
    private readonly ApplicationDbContext _context;

    public ProductQueries(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ProductExistsAsync(string name)
    {
        return await _context.Products.AnyAsync(p => p.Name == name);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> GetProductByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<Product> UpdateProductAsync(int id, Product bodyInfo)
    {
        var initialProduct = await _context.Products.FindAsync(id);
        if (initialProduct == null) return null;

        // Validation
        if (string.IsNullOrEmpty(bodyInfo.Name) ||
            string.IsNullOrEmpty(bodyInfo.ImgUrl) ||
            bodyInfo.Price < 1 ||
            bodyInfo.InStock == 0)
        {
            return null;
        }

        initialProduct.Name = bodyInfo.Name;
        initialProduct.Price = bodyInfo.Price;
        initialProduct.InStock = bodyInfo.InStock;
        initialProduct.ImgUrl = bodyInfo.ImgUrl;

        await _context.SaveChangesAsync();
        return initialProduct;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }
}