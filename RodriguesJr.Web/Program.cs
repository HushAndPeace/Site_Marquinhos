var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

// Railway (e outras plataformas PaaS) injetam a porta via variável de ambiente PORT
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Em produção o Railway termina TLS no proxy — redirecionar HTTPS aqui causaria loop
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapRazorPages();

app.Run();
