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
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, string sortOrder = "asc")
        {
            var query = _bookContext.Books.AsQueryable();

            // ONE if statement to decide sort direction
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

            var totalNumberBooks = _bookContext.Books.Count();
            var someObjects = new
            {
                Books = something,
                TotalNumBooks = totalNumberBooks
            };
            return Ok(someObjects);
        }
    }
}