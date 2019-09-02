﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SocialMedia.Models;

namespace SocialMedia.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.2-servicing-10034")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("SocialMedia.Models.Comment", b =>
                {
                    b.Property<int>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Content");

                    b.Property<DateTime>("DateTime");

                    b.Property<bool>("HasSeen");

                    b.Property<int?>("PostId");

                    b.Property<int?>("ProfileId");

                    b.HasKey("CommentId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("SocialMedia.Models.Friend", b =>
                {
                    b.Property<int>("FriendId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("Accepted");

                    b.Property<DateTime>("DateAccpted");

                    b.Property<DateTime>("DateSent");

                    b.Property<int?>("FromId");

                    b.Property<int?>("ToId");

                    b.HasKey("FriendId");

                    b.ToTable("Friends");
                });

            modelBuilder.Entity("SocialMedia.Models.Image", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("DateTime");

                    b.Property<string>("Name");

                    b.Property<int?>("ProfileId");

                    b.HasKey("ImageId");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("SocialMedia.Models.Like", b =>
                {
                    b.Property<int>("LikeId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("ContentId");

                    b.Property<int>("ContentType");

                    b.Property<DateTime>("DateTime");

                    b.Property<bool>("HasSeen");

                    b.Property<int?>("ProfileId");

                    b.HasKey("LikeId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("SocialMedia.Models.Post", b =>
                {
                    b.Property<int>("PostId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Caption");

                    b.Property<DateTime>("DateTime");

                    b.Property<int?>("ImageId");

                    b.Property<int?>("ProfileId");

                    b.HasKey("PostId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("SocialMedia.Models.Profile", b =>
                {
                    b.Property<int>("ProfileId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Bio");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<string>("Password");

                    b.Property<int>("ProfilePicture");

                    b.HasKey("ProfileId");

                    b.ToTable("Profiles");
                });
#pragma warning restore 612, 618
        }
    }
}
