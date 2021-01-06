﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.Infrastructure;
using SocialMedia.Models;
using SocialMedia.Models.ViewModels;

namespace SocialMedia.Controllers
{
    [Route("api/[controller]")]
    public class ApiCommentController : Controller
    {
        private ICommentRepository commentRepo;
        private IProfileRepository profileRepo;
        private IImageRepository imageRepo;
        private IFriendRepository friendRepo;
        private ILikeRepository likeRepo;
        private CurrentProfile currentProfile;

        public ApiCommentController(
            ICommentRepository commentRepo,
            IProfileRepository profileRepo,
            IImageRepository imageRepo,
            IFriendRepository friendRepo,
            ILikeRepository likeRepo,
            CurrentProfile currentProfile)
        {
            this.commentRepo = commentRepo;
            this.profileRepo = profileRepo;
            this.imageRepo = imageRepo;
            this.friendRepo = friendRepo;
            this.likeRepo = likeRepo;
            this.currentProfile = currentProfile;
        }

        //-----------------------------------------ROUTING---------------------------------------------//

        // Get comment count by PostId XXX shouldn't this go in ApiPostController??
        [HttpGet("commentcount/{id}")]
        public int CommentCount(int id) => commentRepo.Comments.Where(c => c.PostId == id).Count();

        // Delete comment by CommentId
        [HttpPost("deletecomment/{id}")]
        public void DeleteComment(int id)
        {
            Comment comment = commentRepo.ById(id); // get comment by CommentId

            if(comment.ProfileId == currentProfile.id) // validate user ownership of comment
            {
                List<Like> likes = new List<Like>(); // prepare list

                // get likes belonging to this comment 
                // (type 2 is comment likes)
                // XXX use enumeration instead of magic numbers for type
                foreach(Like l in likeRepo.ByTypeAndId(2, id)) { likes.Add(l); }

                // after retrieve operation, delete each retrieved like
                foreach(Like l in likes) { likeRepo.DeleteLike(l); }

                // delete comment retrieved by CommentId
                commentRepo.DeleteComment(commentRepo.ById(id));
            }

        }

        // replace text value of comment with provided id with text provided in request body
        [HttpPost("updatecomment/{id}")]
        public void UpdateComment([FromBody] StringModel content, int id)
        {
            Comment comment = commentRepo.ById(id); // get comment by CommentId

            // content length and comment ownership is verified
            if (content.str.Length > 0 && content.str.Length <= 125 && comment.ProfileId == currentProfile.id)
            {
                comment.Content = Util.Sanitize(content.str); // replace comment text with sanitized text
                commentRepo.SaveComment(comment); // override comment in database
            }
        }

        // get list of comments by id, skip, take
        [HttpGet("postcomments/{id}/{commentCount}/{amount}")]
        public List<CommentModel> PostComments(int id, int commentCount, int amount)
        {
            List<CommentModel> comments = new List<CommentModel>(); // prepare list
            if (commentCount < commentRepo.CountByPostId(id)) // if user has not reached end of comments
            {
                foreach (Comment c in commentRepo.RangeByPostId(id, commentCount, amount)) // get comment results
                {
                    comments.Add(GetCommentModel(c.CommentId)); // prep comment and add to returning list
                }
            }
            else return null; // if user has reached end of comments, return null

            return comments; // return preped comment results
        }

        // get comment by id
        [HttpGet("{id}")]
        public CommentModel GetComment(int id) => GetCommentModel(id);
        
        // create comment from text provided in request body, current datetime, and current user id
        [HttpPost]
        public CommentModel CreateComment([FromBody] Comment comment)
        {
            // content length is verified
            if (comment.Content.Length > 0 && comment.Content.Length <= 125) // if comment is 1-125 chars long
            {
                comment.DateTime = DateTime.UtcNow;  // set DateTime of comment to current DateTime of central time
                comment.ProfileId = currentProfile.id; // set ProfileId of comment to current profile id
                comment.Content = Util.Sanitize(comment.Content); // set Content of comment to the sanitized content provided
                return GetCommentModel(commentRepo.SaveComment(comment)); // save comment to database and return a preped version of it
            }
            else return null; // if length of comment was invalid, return null
        }

        //-----------------------------------------UTIL---------------------------------------------//

        // prep comment to be sent to client
        public CommentModel GetCommentModel(int id)
        {
            Comment comment = commentRepo.ById(id); // get comment by CommentId
            if (comment == null) return null; // if no comment was found, return null
            Profile profile = profileRepo.ById(comment.ProfileId); // get handle on owner of comment
            LikeModel likes = new LikeModel // attach info for likes
            {
                ContentId = id, // link like data to parent comment by CommentId
                ContentType = 2,
                Count = likeRepo.CountByContentId(2, id), // set like count by CommentId
                HasLiked = likeRepo.HasLiked(2, id, currentProfile.id) // determine if user has like and assign value
            };

            return new CommentModel // fill with data from comment and likeModel
            {
                CommentId = comment.CommentId,
                Content = comment.Content,

                // attach prepped ProfileModel XXX shouldn't need to enter all this data about the user
                Profile = Util.GetProfileModel(profile, imageRepo.ById(profile.ProfilePicture), friendRepo.RelationToUser(currentProfile.id, profile.ProfileId)),
                DateTime = comment.DateTime.ToLocalTime(),
                Likes = likes,
                PostId = comment.PostId
            };
        }
    }
}