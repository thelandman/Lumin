﻿/*
    This class contains the functionality for the profile modal.
*/
class ProfileModal extends Modal {

    // XXX This is not used. XXX
    private content;
    
    // Container elm for a PostsBox that is below the profile modal header.
    private postWrapper: HTMLElement;
    
    // ImageBox for profile picture.
    public profilePictureBox: ImageBox;
    
    // Container elm for an ProfileImagesBox.
    private imageWrapper: HTMLElement;

    // The profile name display wrapper.
    private profileNameWrapper: HTMLElement;
    private btnChangeName: HTMLElement;
    private nameEditor: DoubleEditor;
    
    // Container elm for Editor. Also used to store btnChangeBio.
    private profileBioWrapper: HTMLElement;

    // Starts editing process. Added and removed from profileBioWrapper depending on if profile is the current user's.
    private btnChangeBio: HTMLElement;
    
    // An Editor used to display and sometimes edit the bio.
    private bioEditor: Editor;
    
    // A FULL profile. The profile being displayed. 
    private profile: FullProfileRecord;
    
    // Container elm for imageWrapper. Enables scrolling.
    private imageScrollBox: HTMLElement;
    
    // A ProfileImagesBox used to show a profile's images.
    private imagesBox: ProfileImagesBox;
    
    // A ContentBox used to show a profile's friends.
    private friendBox: ContentBox;
    private friendBoxElm: HTMLElement;

    private btnTogglePostFeedFilter: HTMLElement;
    private feedFilter: 'recent' | 'likes' | 'comments' = 'recent';

    private btnRefreshProfilePostFeed: HTMLElement;

    // A PostsBox for displaying a profile's posts.
    private postBox: PostsBox;

    // STAGE FLAGS
    private fullProfileStaged: StageFlag = new StageFlag();
    private imagesBoxStaged: StageFlag = new StageFlag();
    private friendsStaged: StageFlag = new StageFlag();

    private stage: Stage;

    private stageContainers: HTMLElement[];

    /*
        Sudo-inherits from the sudo-base class.
        Gets handles on all necessary components.
    */
    public constructor(
        rootElm: HTMLElement,
        content: HTMLElement,
        profileNameWrapper: HTMLElement,
        postWrapper: HTMLElement,
        imageWrapper: HTMLElement,
        profileBioWrapper: HTMLElement,
        imageBoxElm: HTMLElement,
        imageScrollBox: HTMLElement,
        friendBoxElm: HTMLElement,
        btnTogglePostFeedFilter: HTMLElement,
        btnRefreshProfilePostFeed: HTMLElement,
        imageClassList: string,
        editorClassList: string,
        doubleEditorClassList: string
    ) {
        super(rootElm);

        // Get handles on modal HTML elms.
        this.content = content;
        this.postWrapper = postWrapper;
        this.imageWrapper = imageWrapper;
        this.profileNameWrapper = profileNameWrapper;
        this.profileBioWrapper = profileBioWrapper;
        this.imageScrollBox = imageScrollBox;
        this.friendBoxElm = friendBoxElm;
        this.btnTogglePostFeedFilter = btnTogglePostFeedFilter;
        this.btnRefreshProfilePostFeed = btnRefreshProfilePostFeed;
        this.btnChangeName = ViewUtil.tag('i', { classList: 'fa fa-edit', id: 'btnChangeName' });
        this.btnChangeBio = ViewUtil.tag('i', { classList: 'fa fa-edit', id: 'btnChangeBio' });

        // Construct an ImageBox for the profile picture and get a handle on it.
        this.profilePictureBox = new ImageBox(imageBoxElm, imageClassList, null);
        
        this.nameEditor = new DoubleEditor(this.btnChangeName, '', '', doubleEditorClassList, 30,
            (firstName: string, lastName: string) => {
                ProfileCard.changeUserProfileName(firstName, lastName);
                Ajax.updateName(JSON.stringify({ FirstName: firstName, LastName: lastName }));
            });
        this.profileNameWrapper.append(this.nameEditor.rootElm);
        
        // Construct an Editor for profile bio and get a handle on it.
        this.bioEditor = new Editor(this.btnChangeBio, '', editorClassList, true, 250, (bio: string) => Ajax.updateBio(bio));
        this.profileBioWrapper.append(this.bioEditor.rootElm);

        this.btnTogglePostFeedFilter.onclick = (event: MouseEvent) => this.togglePostFeedFilter();
        this.btnRefreshProfilePostFeed.onclick = (event: MouseEvent) => this.refreshProfilePostFeed();

        this.postBox = new PostsBox(0, this.postWrapper, this.rootElm);

        this.stageContainers = [
            this.profilePictureBox.rootElm, this.profileNameWrapper,
            this.profileBioWrapper, this.friendBoxElm, this.imageScrollBox
        ]

        this.stage = new Stage([this.fullProfileStaged, this.imagesBoxStaged, this.friendsStaged],
            () => {
                this.stageContainers.forEach((container: HTMLElement) => {
                    ViewUtil.show(container, null, () => {
                        container.style.opacity = '1';
                    });
                });
            }
        );
    }
    
    /*
        Loads profile information into the different slots and then opens this modal.
    */
    public load(profileId: number): void {
        
        // Clear out modal.
        this.reset();

        Ajax.getFullProfile(profileId, (fullProfile: FullProfileRecord) => {

            // Get a handle on the new profile.
            this.profile = fullProfile;

            // Set name display.
            this.nameEditor.setText2(this.profile.firstName, this.profile.lastName); 
            this.bioEditor.setText(this.profile.bio);

            // Set profile picture display.
            this.profilePictureBox.loadImage(new ImageCard(this.profile.profilePicture));

            this.stage.updateStaging(this.fullProfileStaged);
        });

        // PRIVATE PROFILE OPTIONS
        // If profile is current user's,
        if (profileId == User.profileId) {

            // set click callback of profile picture to invoke select profile picture,
            this.profilePictureBox.heldImageClick = (target: ImageCard) => this.selectProfilePicture()
            this.profilePictureBox.heldTooltipMsg = 'Change profile picture';

            // give button for user to edit bio,
            this.profileNameWrapper.append(this.btnChangeName);
            this.profileBioWrapper.append(this.btnChangeBio);
        }

        // else, this profile is not the current user's so,
        else {

            // set click callback of profile picture to display it in fullsize image modal,
            this.profilePictureBox.heldImageClick = (target: ImageCard) => fullSizeImageModal.loadSingle(target.image.imageId);
            this.profilePictureBox.heldTooltipMsg = 'Fullscreen';

            // and detach the button to edit the bio.
            ViewUtil.remove(this.btnChangeName);
            ViewUtil.remove(this.btnChangeBio);
        }
        
        // Construct new ProfileImageBox and set up profile images display.
        this.imagesBox = new ProfileImagesBox(profileId, 'Fullscreen', this.imageScrollBox, (target: ImageCard) =>
            
            // Set click callback of each image to open a collection in fullzise image modal.
            fullSizeImageModal.load(this.imagesBox.content.indexOf(target), profileId));

        this.imagesBox.onLoadEnd = () => this.stage.updateStaging(this.imagesBoxStaged);

        // Append new profile images box to container elm.
        this.imageWrapper.append(this.imagesBox.rootElm);

        // Request friends by ProfileID and load them into friendBox when they arrive as profile cards.
        Ajax.getFriends(profileId, null, (profileCards: ProfileCard[]) => {
            this.friendBox.add(profileCards);
            this.stage.updateStaging(this.friendsStaged);
        });
    
        // Create post box and start feed.
        this.postBox.profileId = profileId;
        this.postBox.start();
        
        // Open this modal.
        super.open();
    }

    private togglePostFeedFilter(): void {

        let feedFilterSecondIcon = this.btnTogglePostFeedFilter.children[1];
        
        switch (this.feedFilter) {
            case 'recent': { // Switch to likes. Next: comments
                this.feedFilter = 'likes';
                this.btnTogglePostFeedFilter.title = 'Sort by comment popularity';
                feedFilterSecondIcon.classList.remove('fa-thumbs-up');
                feedFilterSecondIcon.classList.add('fa-comments');
                break;
            }
            case 'likes': { // Switch to comments. Next: recent
                this.feedFilter = 'comments';
                this.btnTogglePostFeedFilter.title = 'Sort by recent';
                feedFilterSecondIcon.classList.remove('fa-comments');
                feedFilterSecondIcon.classList.add('fa-calendar');
                break;
            }
            case 'comments': { // Switch to recent. Next: likes
                this.feedFilter = 'recent';
                this.btnTogglePostFeedFilter.title = 'Sort by like popularity';
                feedFilterSecondIcon.classList.remove('fa-calendar');
                feedFilterSecondIcon.classList.add('fa-thumbs-up');
                break;
            }
        }

        this.postBox.clear();
        this.postBox.requestCallback = (skip: number, take: number) => {
            Ajax.getProfilePosts(this.profile.profileId, skip, take, this.feedFilter, (postCards: PostCard[]) => {

                if (postCards == null) return;
                this.postBox.add(postCards);
            });
        }

        this.postBox.start();
    }

    private refreshProfilePostFeed() {
        this.postBox.clear();
        this.postBox.start();
    }

    /*
        Opens and configures the image dropdown to return the image the user selects.
    */
    private selectProfilePicture(): void {

        // Load image dropdown for current user and set the onclick to change profile picture.
        imageDropdown.load(User.profileId, "Select a profile picture", "Set profile picture", (target: ImageCard) => {

            // Close the image dropdown.
            imageDropdown.close();

            // Reset z index of dropdown.
            imageDropdown.rootElm.style.zIndex = '0'; // XXX move to onclose of imageDropdown. XXX

            // Change any occurence of the user's profile picture to the newly selected one.
            ProfileCard.changeUserProfilePicture(target);

            // Update stored shorcut to profile picture.
            User.profilePictureId = target.image.imageId;

            navBar.btnOpenUserProfileModalImageBox.loadImage(ImageCard.copy(target));

            // Inserts the low res thumbnail as a placeholder until the fullsize version is returned.
            this.profilePictureBox.loadImage(ImageCard.copy(target, null, 'Change profile picture'));

            // Send an update request to the host to change the profile picture in the profile record.
            Ajax.updateProfilePicture(target.image.imageId, null, 'Change profile picture', null,

                // When the host sends back the fullsize version of the new profile picture, load it into the profile modal display.
                (imageCard: ImageCard) =>
                    this.profilePictureBox.loadImage(imageCard));
        });
    }

    /*
        Empties out the containers that are refilled on load and deletes the components that are reconstructed on load.
    */
    private reset(): void {

        // Emptie out the containers that are refilled on load.
        ViewUtil.empty(this.imageWrapper);

        // Delete the components that are reconstructed on load.
        delete this.imagesBox;

        // Clear name and bio.
        this.nameEditor.setText2('', '');
        this.bioEditor.setText('');

        // FRIENDS BOX
        // Construct new Content box and set of friends display.
        this.friendBox = new ContentBox(this.friendBoxElm);

        // Clear friends box and posts box. Even though these were just constructed, they reused an existing elm that could still have cards in it.
        this.friendBox.clear();
        this.postBox.clear();

        // Change style to 'blank' state.
        this.stageContainers.forEach((container: HTMLElement) => {
            container.style.opacity = '0';
            ViewUtil.hide(container);
        });

        this.stage.stageFlags.forEach((flag: StageFlag) => flag.lower());
    }
}