using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;

namespace MC.ClientPortal.WebApi.Models
{    

    /// <summary>
    /// A basic implementation for an application database context compatible with ASP.NET Identity 2 using
    /// <see cref="long"/> as the key-column-type for all entities.
    /// </summary>
    /// <remarks>
    /// This type depends on some other types out of this assembly.
    /// </remarks>
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Int32, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>
    {
        #region constructors and destructors

        public ApplicationDbContext()
            : base("WebApiOwinEntities")
        {
        }

        #endregion

        #region methods

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
                        
            // Map Entities to their tables.
            modelBuilder.Entity<ApplicationUser>().ToTable("Contacts");
            modelBuilder.Entity<ApplicationRole>().ToTable("WebRoles");
            //modelBuilder.Entity<ApplicationUserClaim>().ToTable("UserClaim");
            //modelBuilder.Entity<ApplicationUserLogin>().ToTable("UserLogin");
            modelBuilder.Entity<ApplicationUserRole>().ToTable("WebUserRoles");

            // Set AutoIncrement-Properties
            modelBuilder.Entity<ApplicationUser>().Property(r => r.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            //modelBuilder.Entity<ApplicationUserClaim>().Property(r => r.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            modelBuilder.Entity<ApplicationRole>().Property(r => r.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            
            // Override some column mappings that do not match our default
            modelBuilder.Entity<ApplicationUser>().Property(r => r.Id).HasColumnName("ContactId");
            modelBuilder.Entity<ApplicationUser>().Property(r => r.PhoneNumber).HasColumnName("Phone1");
            modelBuilder.Entity<ApplicationUser>().Property(r => r.EmailConfirmed).HasColumnName("EmailValidated");
            modelBuilder.Entity<ApplicationUser>().Property(r => r.AccessFailedCount).HasColumnName("FailedLoginAttempts");


            modelBuilder.Entity<ApplicationRole>().Property(r => r.Id).HasColumnName("RoleId");
            modelBuilder.Entity<ApplicationRole>().Property(r => r.Name).HasColumnName("Description");


            modelBuilder.Entity<ApplicationUserRole>().Property(r => r.RoleId).HasColumnName("RoleId");
            modelBuilder.Entity<ApplicationUserRole>().Property(r => r.UserId).HasColumnName("ContactId");


            //modelBuilder.Entity<ApplicationUserRole>().Property(r => r.UserId).HasColumnName("ContactID");


        }

        #endregion
    }
}