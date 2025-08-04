using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AlunoAPI.Models;

namespace AlunoAPI.Data
{
    public class AlunoAPIContext : DbContext
    {
        public AlunoAPIContext (DbContextOptions<AlunoAPIContext> options)
            : base(options)
        {
        }

        public DbSet<AlunoAPI.Models.Aluno> Aluno { get; set; } = default!;
    }
}

using Microsoft.EntityFrameworkCore;

namespace AlunoAPI.Data
{
    public class AlunoContext : DbContext
    {
        public AlunoContext(DbContextOptions<AlunoContext> options) : base(options)
        {
        }

        public DbSet<Models.Aluno> Alunos { get; set; }
    }
}
