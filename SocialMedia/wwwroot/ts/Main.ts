﻿var navBar: NavBar;
var contextMenu: ContextMenu;
var confirmPrompt: ConfirmPrompt;

var createPostModal: CreatePostModal;
var fullSizeImageModal : FullSizeImageModal;
var profileModal : ProfileModal;
var uploadImageModal : UploadImageModal;
var publicPosts : PublicPosts;
var helpModal: HelpModal;

var imageDropdown : ImageDropdown;
var friendDropdown : FriendDropdown;

class Main {
    
    // XXX Translate profile. XXX
    static initialize(profile) {

        User.profileId = profile.profileId;
        User.profilePictureId = profile.profilePicture;

        navBar = new NavBar(
            document.getElementById('navBar'),
            document.getElementById('publicPosts'),
            document.getElementById('btnOpenUserProfileModal')
        );

        // PUBLIC POST FEED
        publicPosts = new PublicPosts(document.getElementById('publicPosts'));

        // CONTEXT PROMPT
        contextMenu = new ContextMenu(
            document.getElementById('contextMenu'),
            document.getElementById('contextContent')
        );

        // CONFIRM MENU
        confirmPrompt = new ConfirmPrompt(
            document.getElementById('confirmPrompt'),
            document.getElementById('confirmContent'),
            document.getElementById('promptMessage'),
            document.getElementById('btnConfirmYes'),
            document.getElementById('btnConfirmNo')
        );

        // MODALS --------------------------------------------------
        Modal.initialize(
            document.getElementById('modalFrameTemplate'),
            document.getElementById('modalFrameContainer'),
            document.getElementById('btnCloseModal')
        );

        createPostModal = new CreatePostModal(
            document.getElementById('createPostModal'),
            <HTMLInputElement>document.getElementById('caption'),
            document.getElementById('captionWrapper'),
            document.getElementById('btnSubmit'),
            document.getElementById('btnClearAttachment'),
            document.getElementById('selectedImageCon'),
            document.getElementById('lblCaptionCharacterCount'),
            'selectedPostImage',
            'createPostErrorBox'
        );

        fullSizeImageModal = new FullSizeImageModal(
            document.getElementById('fullSizeImageModalContent'),
            document.getElementById('btnFullsizePrevious'),
            document.getElementById('btnFullsizeNext'),
            document.getElementById('imageCount'),
            document.getElementById('imageDateTime'),
            document.getElementById('fullsizeImageBox'),
            'fullSizeImage'
        );

        profileModal = new ProfileModal(
            document.getElementById('profileModal'),
            document.getElementById('profileNameWrapper'),
            document.getElementById('profileImages'),
            document.getElementById('profileBioWrapper'),
            document.getElementById('profileImagesWrapper'),
            document.getElementById('profileFriends'),
            document.getElementById('relationWrapper'),
            document.getElementById('profilePostBoxes'),
            document.getElementById('commentedProfilePostsBox'),
            document.getElementById('likedProfilePostsBox'),
            document.getElementById('mainProfilePostsBox'),
            document.getElementById('profileModalPictureWrapper'),
            document.getElementById('btnToggleSearchBar'),
            document.getElementById('btnTogglePostFeedFilter'),
            document.getElementById('btnRefreshProfilePostFeed'),
            document.getElementById('btnMyPostActivity'),
            document.getElementById('btnSearchPosts'),
            <HTMLInputElement>document.getElementById('txtSearchPosts'),
            document.getElementById('profileSettings'),
            document.getElementById('btnToggleProfileSettings'),
            document.getElementById('profilePictureSetting'),
            document.getElementById('profileBioSetting'),
            document.getElementById('profileImagesSetting'),
            document.getElementById('profileFriendsSetting'),
            document.getElementById('profilePostsSetting'),
            'profile-picture sqr',
            'bio',
            'name'
        );

        uploadImageModal = new UploadImageModal(
            document.getElementById('imageUploadModal'),
            document.getElementById('stagedUploadCon'),
            document.getElementById('btnConfirmImageUpload'),
            document.getElementById('uploadImageModalUploadImage'),
            'stagedUpload',
            'errorMsg uploadImageError'
        );

        helpModal = new HelpModal(document.getElementById('helpContent'));

        // DROPDOWNS
        Dropdown.initialize(
            document.getElementById('dropdownFrameTemplate'),
            document.getElementById('dropdownFrameContainer')
        );

        imageDropdown = new ImageDropdown(
            document.getElementById('imageDropdown'),
            document.getElementById('imageDropDownContent'),
            document.getElementById('selectImages'),
            document.getElementById('selectImagePrompt'),
            document.getElementById('imageModalUploadImage'),
            document.getElementById('btnShowImages')
        );

        friendDropdown = new FriendDropdown(
            document.getElementById('friendsDropdown'),
            document.getElementById('friendDropdownContent'),
            <HTMLInputElement> document.getElementById('txtSearchFriends'),
            document.getElementById('btnSearchFriends'),
            document.getElementById('friendsPrompt'),
            document.getElementById('friends'),
            document.getElementById('btnShowFriends')
        );
    }
}