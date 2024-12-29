using Microsoft.AspNetCore.Authorization;  // Add this
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    //create

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        if (await _context.Products.AnyAsync(p => p.Name == product.Name))
            return BadRequest("Product already exists");

        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    //get

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        return product;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    //update

    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, Product bodyInfo)
    {
        var initialProduct = await _context.Products.FindAsync(id);
        if (initialProduct == null) return NotFound();
        if(bodyInfo.Name == null)
        {
            return BadRequest("The name has to have to be not nullable");
        }
        if (bodyInfo.ImgUrl== null)
        {
            return BadRequest("The imgUrl has to be a real URL");
        }
        if (bodyInfo.Price < 1)
        {
            return BadRequest("Price has to be higher than 0");
        }
        if (bodyInfo.InStock == 0)
        {
            return BadRequest("The stock has to be higher than 0");
        }

        initialProduct.Name = bodyInfo.Name;
        initialProduct.Price = bodyInfo.Price;
        initialProduct.InStock = bodyInfo.InStock;
        initialProduct.ImgUrl = bodyInfo.ImgUrl;


        await _context.SaveChangesAsync();
        return Ok(initialProduct);
    }

    //delete
    [HttpDelete("{id}")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();

    }
}