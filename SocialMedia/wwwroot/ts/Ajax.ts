﻿class Ajax {

    private static JSONstring(string): string { return JSON.stringify({ str: string }); }

    //LIKE
    public static unlike(contentType: ContentType, contentId: number): void {
        this.call(`apilike/unlike/${contentType.toString}/${contentId}`, "POST");
    }

    public static postLike(contentType: ContentType, contentId: number): void {
        this.call(`apilike/like/${contentType.toString}/${contentId}`, "POST");
    }

    public static getLikes(contentType: ContentType, contentId: number): void {
        this.call(`apilike/likes/${contentType.toString}/${contentId}`, "GET");
    } // NOT IN USE


    //COMMENT
    public static deleteComment(commentId: number): void {
        this.call(`apicomment/deletecomment/${commentId}`, "POST");
    }

    public static updateComment(commentId: number, commentText: string): void {
        this.call(`apicomment/updatecomment/${commentId}`, "POST", null, commentText);
    }

    public static postComment(commentForm: string, onCopyResults: (commentCard: CommentCard) => void): void {
        this.call(
            "apicomment", 
            "POST",
            results => onCopyResults(new CommentCard(JSON.parse(results))),
            commentForm
        );
    }

    public static getComments(postId: number, skip: number, take: number, onCommentResults: (commentCards: CommentCard[]) => void): void {
        this.call(
            `apicomment/postcomments/${postId}/${skip}/${take}`,
            "GET",
            (commentResults: string)=> onCommentResults(CommentCard.list(JSON.parse(commentResults)))
        );
    }

    public static getCommentCount(postId: number, onCommentCountResults: (commentCount) => void): void {
        this.call(`apicomment/commentcount/${postId}`, "GET", onCommentCountResults);
    }

    //PROFILE
    public static updateBio(bioText: string): void {
        this.call("apiprofile/updatebio", "POST", null, this.JSONstring(bioText));
    }

    public static updateProfilePicture(
        imageId: number,
        imageClassList?: string,
        onImageClick?: (targetImageCard: ImageCard) => void,
        onCopyResults?: (fullsizeImageCard: ImageCard) => void
    ): void {
        this.call(
            `apiprofile/updateprofilepicture/${imageId}`,
            "POST",
            imageResults => onCopyResults(new ImageCard(JSON.parse(imageResults), imageClassList, onImageClick))
        );
    }

    public static getProfile(profileId: number, onProfileResults: (profileCard: ProfileCard) => void): void {
        this.call(
            `apiprofile/${profileId}`,
            "GET",
            profileResults => onProfileResults(new ProfileCard(JSON.parse(profileResults)))
        );
    }

    public static getFullProfile(profileId: number, onFullProfileResults: (fullProfile: FullProfileRecord) => void): void {
        this.call(
            `apiprofile/fullprofile/${profileId}`,
            "POST",
            (fullProfileResults: string) => {
                onFullProfileResults(JSON.parse(fullProfileResults));
            }
        );
    }

    public static getCurrentProfile(onCurrentProfileResults: (currentProfile) => void): void {
        this.call("apiprofile/currentprofile", "GET", onCurrentProfileResults);
    }


    //FRIEND
    public static deleteFriend(profileId: number): void {
        this.call(`apifriend/deletefriend/${profileId}`, "POST");
    } // remove

    public static acceptFriendRequest(profileId: number): void {
        this.call(`apifriend/acceptrequest/${profileId}`, "POST");
    } // accept

    public static sendFriendRequest(profileId: number): void {
        this.call(`apifriend/createrequest/${profileId}`, "POST");
    } // request
    
    public static getFriends(profileId: number, searchText: string, onProfileResults: (profileCards: ProfileCard[]) => void): void {

        let newId = profileId ? profileId : 0;
        let newSearch = this.JSONstring(searchText ? searchText : "NULL");
        
        this.call(
            `apifriend/friends/${newId}`,
            "POST", 
            (profileResults: string) => onProfileResults(ProfileCard.list(JSON.parse(profileResults))),
            newSearch
        );
    }


    //IMAGE
    public static deleteImage(imageId: number): void {
        this.call(`apiimage/deleteimage/${imageId}`, "POST");
    }

    public static postImage(imageAsString: string, onCopyResults: (returnImageCard: ImageCard) => void): void {
        this.call(
            "apiimage", 
            "POST", 
            (imageCopy: string) => onCopyResults(new ImageCard(JSON.parse(imageCopy))),
            imageAsString
        );
    }

    public static getProfileImages(
        profileId: number,
        skip: number,
        take: number,
        imageClassList: string,
        onImageClick: (targetImageCard: ImageCard) => void,
        onImageResults: (imageCards: ImageCard[]) => void
    ): void {
        this.call(
            `apiimage/profileimages/${profileId}/${skip}/${take}`, 
            "GET",
            (imageResults: string) => onImageResults(ImageCard.list(JSON.parse(imageResults), imageClassList, onImageClick))
        );
    }

    public static getProfileImagesCount(profileId: number, onCountResults: (imageCount) => void): void {
        this.call(`apiimage/profileimagescount/${profileId}`, "GET", onCountResults);
    }

    public static getImage(
        imageId: number,
        thumb: boolean,
        imageClassList: string,
        onImageClick: (targetImageCard: ImageCard) => void,
        onImageResults: (imageCard: ImageCard) => void
    ): void {
        this.call(
            `apiimage/${imageId}/${thumb ? 1 : 0}`, 
            "GET",
            (imageResults: string) => onImageResults(new ImageCard(JSON.parse(imageResults), imageClassList, onImageClick))
        );
    }


    //POST
    public static deletePost(postId: number): void {
        this.call(`apipost/deletepost/${postId}`, "POST");
    }

    public static updatePost(postId: number, postCaptionText: string): void {
        this.call(`apipost/updatepost/${postId}`, "POST", null, this.JSONstring(postCaptionText));
    }

    public static submitPost(postForm: string, onCopyResults: (postCard: PostCard) => void): void {
        this.call(
            "apipost",
            "POST",
            (copyResults: string) => onCopyResults(new PostCard(JSON.parse(copyResults))),
            postForm
        );
    }

    public static getPublicPosts(skip: number, take: number, onPostResults: (postCards: PostCard[]) => void): void {
        this.call(
            `apipost/publicposts/${skip}/${take}`,
            "GET",
            (postResults: string) => onPostResults(PostCard.list(JSON.parse(postResults)))
        );
    }

    public static getProfilePosts(profileId: number, skip: number, take: number, onPostResults: (postCards: PostCard[]) => void): void {
        this.call(
            `apipost/profileposts/${profileId}/${skip}/${take}`, 
            "GET",
            (postResults: string) => onPostResults(PostCard.list(JSON.parse(postResults)))
        );
    }


    //CALL
    private static call(path: string, method: string, onResults?: (results: string) => void, data?: string): void {

        // check server for current user (redirect if session is expired)
        this.finalCall("apiprofile/confirmuser", "GET", confirmed => {
            if (confirmed) this.finalCall(path, method, onResults, data);
            else location.reload(true);
        });
    }

    private static finalCall(path: string, method: string, onResults?: (results: string) => void, data?: string): void {
        $.ajax({
            url: "/api/" + path,
            contentType: "application/json",
            method: method,
            data: data,
            success: results => { if (onResults) onResults(results); }
        });
    }
}