using Microsoft.AspNetCore.Authorization;  // Add this
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductQueries _productQueries;

    public ProductController(ProductQueries productQueries)
    {
        _productQueries = productQueries;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        if (await _productQueries.ProductExistsAsync(product.Name))
            return BadRequest("Product already exists");

        var createdProduct = await _productQueries.CreateProductAsync(product);
        return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _productQueries.GetProductByIdAsync(id);
        if (product == null) return NotFound();
        return product;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _productQueries.GetAllProductsAsync();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, Product bodyInfo)
    {
        var updatedProduct = await _productQueries.UpdateProductAsync(id, bodyInfo);
        if (updatedProduct == null)
        {
            if (await _productQueries.GetProductByIdAsync(id) == null)
                return NotFound();

            return BadRequest("Invalid product data. Check name, imgUrl, price, and stock.");
        }
        return Ok(updatedProduct);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        var success = await _productQueries.DeleteProductAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}