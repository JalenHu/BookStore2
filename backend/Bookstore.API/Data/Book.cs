using System.ComponentModel.DataAnnotations;

namespace WaterProject.API.Data;

public class Book
{
    [Key]
    public int BookId { get; set; }
    [Required]
    public string Title { get; set; }
    public string Author { get; set; }
    public string Publisher {get; set;}
    public int ISBN {get; set;}
    public string Classification {get; set;}
    public string Category { get; set; }                    
    public int PageCount { get; set; }
    public decimal Price { get; set; }
    
} 