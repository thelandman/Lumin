﻿class ImageCard extends Card {
    
    public static imageCards = [];

    public static copy(
        imageCard: ImageCard,
        newClassList: string = imageCard.rootElm.classList.value,
        newOnImageClick: (targetImageCard: ImageCard) => void = () => imageCard.rootElm.onclick
    ): ImageCard {
        return new ImageCard(imageCard.image, newClassList, newOnImageClick);
    }

    public static list(images: ImageRecord[], classList: string, onImageClick?: (targetImageCard: ImageCard) => void): ImageCard[] {
        if (!images) return null;
        let imageCards = [];
        images.forEach(i => imageCards.push(new ImageCard(i, classList, onImageClick)));
        return imageCards;
    }

    // /STATIC
    // ---------------------------------------------------------------------------------------------------------------
    // NON-STATIC

    public image: ImageRecord;
    
    // ON IMAGE CLICK
    private _onImageClick:         (target: ImageCard) => void;
    get onImageClick():            (target: ImageCard) => void  { return this._onImageClick; }
    set onImageClick(onImageClick: (target: ImageCard) => void) {

        // XXX consider getting rid of _onImageClick. Instead, get the value of this.rootElm.onclick. XXX
        // Set the value of the two properties to a function that send this instance back through the onImageClick callback.
        this._onImageClick = (target: ImageCard) => onImageClick(target);
        this.rootElm.onclick = (event: MouseEvent) => onImageClick(this);
    }

    public constructor(image: ImageRecord, classList?: string, onImageClick?: (target: ImageCard) => void) {
        
        super(ViewUtil.tag('img', {
            src: image.imageAsByteArray,
            classList: classList
        }));

        // Store the image record in this instance.
        this.image = image;

        // L-Click on imageCard action.
        this.onImageClick = onImageClick ? onImageClick : (target: ImageCard) => fullSizeImageModal.loadSingle(target.image.imageId);

        // R-Click on imageCard action.
        if (image.profileId == User.profileId) this.rootElm.oncontextmenu = (event: MouseEvent) => 

            // and loads the context modal with options and the mouseEvent.
            contextMenu.load(event, [

                new ContextOption(Icons.createPost(), () => {
                    imageDropdown.close();
                    createPostModal.load(this);
                }),
                new ContextOption(Icons.deleteImage(), () => {
                    confirmPrompt.load('Are you sure you want to delete this image?', confirmation => {
                        if (!confirmation) return;
                        this.remove();

                        //return answer == false? null : imageCard.remove(); // TEST THIS XXXXXXXXXXXXX
                    });
                })
            ]);
        
        ImageCard.imageCards.push(this);
    }

    public remove(): void {
        Ajax.deleteImage(this.image.imageId);

        PostCard.postCards.forEach((p: PostCard) => {
            // Only need to remove tag. Cascading delete in db is done on server.
            if (p.post.image != null && p.post.image.imageId == this.image.imageId)
                ViewUtil.remove(p.rootElm);
        });

        // XXX this ought to go in a static method in ProfileImagesBox. Or even in ContentBox. XXX
        ProfileImagesBox.profileImageBoxes.forEach((p: ProfileImagesBox) => {
            p.removeImageCard(this);
        });

        // If the user deleted the image that was their profile picture, change all occurances of their profile picture to the defualt.
        if (this.image.imageId == User.profilePictureId)
            Ajax.getImage(0, true, 'sqr', () => { }, (imageCard: ImageCard) =>
                ProfileCard.changeUserProfilePicture(imageCard));

        // XXX instead, fullsizeImage modal should change to the next or prev image (prev as default), and if singular THEN close.
        fullSizeImageModal.close();// temporary solution
        
        //delete this; XXX
    }

}