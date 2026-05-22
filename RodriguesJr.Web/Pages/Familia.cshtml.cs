using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RodriguesJr.Web.Pages;

public class FamiliaModel : PageModel
{
    private readonly ILogger<FamiliaModel> _logger;

    public FamiliaModel(ILogger<FamiliaModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
    }
}
