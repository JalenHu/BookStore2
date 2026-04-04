using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

namespace WaterProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookstoreController : ControllerBase
    {
        private BookDbContext _bookContext;
        
        public BookstoreController(BookDbContext temp) =>_bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, string sortOrder = "asc", string? category = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            if (sortOrder == "desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }
            else
            {
                query = query.OrderBy(b => b.Title);
            }

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumberBooks = query.Count();
            var someObjects = new
            {
                Books = something,
                TotalNumBooks = totalNumberBooks
            };
            return Ok(someObjects);
        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();
            return Ok(categories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book book)
        {
            _bookContext.Books.Add(book);
            _bookContext.SaveChanges();
            return Ok(book);
        }

        [HttpPut("UpdateBook/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book book)
        {
            var existing = _bookContext.Books.Find(id);
            if (existing == null) return NotFound();

            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Publisher = book.Publisher;
            existing.ISBN = book.ISBN;
            existing.Classification = book.Classification;
            existing.Category = book.Category;
            existing.PageCount = book.PageCount;
            existing.Price = book.Price;

            _bookContext.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _bookContext.Books.Find(id);
            if (book == null) return NotFound();

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();
            return NoContent();
        }
    }
}