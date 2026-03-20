using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

namespace WaterProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Bookstore : ControllerBase
    {
        private BookDbContext _bookContext;
        
        public Bookstore(BookDbContext temp) =>_bookContext = temp;
        
        [HttpGet("AllProjects")]
        public IActionResult GetProjects(int pageSize = 10, int pageNum =1)
        {
            var something = _bookContext.Books
            .Skip((pageNum - 1) * pageSize)        
            .Take(pageSize)
            .ToList();

            var totalNumberProjects = _bookContext.Books.Count();
            var someObjects = new
            {
                Projects = something,
                TotalNumProject = totalNumberProjects
            };
            return Ok(someObjects);
        }
    }
}