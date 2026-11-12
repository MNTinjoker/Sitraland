using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;

namespace SitraLand_Api.Tests;

internal sealed class TestDatabase : IDisposable
{
    private readonly SqliteConnection _connection;

    public DatabaseContext Context { get; }

    public TestDatabase()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseSqlite(_connection)
            .Options;

        Context = new DatabaseContext(options);
        Context.Database.EnsureCreated();
    }

    public void Dispose()
    {
        Context.Dispose();
        _connection.Dispose();
    }
}
