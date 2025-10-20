using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CoreBusiness.Entities;

namespace AlunoAPI.Data
{
    public class AlunoAPIContext : DbContext
    {
        public AlunoAPIContext (DbContextOptions<AlunoAPIContext> options)
            : base(options)
        {
        }

        public DbSet<CoreBusiness.Entities.Aluno> Aluno { get; set; } = default!;
        public DbSet<CoreBusiness.Entities.Escola> Escola { get; set; } = default!;
        public DbSet<CoreBusiness.Entities.Professor> Professor { get; set; } = default!;
    }
}
