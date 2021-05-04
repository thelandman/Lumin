var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FullSizeImageModal = (function (_super) {
    __extends(FullSizeImageModal, _super);
    function FullSizeImageModal(rootElm, btnPrev, btnNext, imageCount, imageDateTime, imageBoxElm, imageClassList) {
        var _this = _super.call(this, rootElm) || this;
        _this.isSingular = null;
        rootElm.onclick = function (event) { if (event.target == rootElm)
            _this.close(); };
        _this.btnPrev = btnPrev;
        _this.btnNext = btnNext;
        _this.imageCount = imageCount;
        _this.imageDateTime = imageDateTime;
        _this.imageClassList = imageClassList;
        _this.imageControls = [_this.imageCount, _this.imageDateTime, _this.btnNext, _this.btnPrev, Modal.btnClose];
        _this.imageCon = new ImageBox(imageBoxElm, imageClassList, 'Toggle controls', function (target) { return _this.toggleControls(); });
        _this.imageCon.onLoadEnd = function () {
            return _this.imageDateTime.innerText = "Uploaded on " + Util.formatDateTime(_this.imageCon.imageCard.image.dateTime);
        };
        _this.btnPrev.onclick = function (e) { return _this.requestImage(_this.index - 1); };
        _this.btnNext.onclick = function (e) { return _this.requestImage(_this.index + 1); };
        document.addEventListener("keydown", function (event) {
            if (_this.hasFocus && !_this.isSingular) {
                if (event.keyCode == 37)
                    _this.btnPrev.click();
                else if (event.keyCode == 39)
                    _this.btnNext.click();
            }
        });
        return _this;
    }
    FullSizeImageModal.prototype.loadSingle = function (imageId) {
        var _this = this;
        this.imageCon.load(imageId, this.imageClassList, 'Toggle controls', function (target) { return _this.toggleSingularControls(); });
        this.hideControls();
        this.showSingularControls();
        this.openOverrided();
        this.isSingular = true;
    };
    FullSizeImageModal.prototype.load = function (clickedImageIndex, profileId) {
        var _this = this;
        this.profileId = profileId ? profileId : User.profileId;
        this.index = clickedImageIndex;
        Ajax.getProfileImagesCount(this.profileId, function (imageCount) {
            _this.profileImagesCount = +imageCount;
            _this.updateImageCount();
            _this.requestImage(_this.index);
        });
        this.openOverrided();
        Ajax.getProfile(profileId, function (profileCard) {
            var promptMsg = (profileId == User.profileId) ? "My images" : profileCard.profile.firstName + " " + profileCard.profile.lastName + "'s images";
            imageDropdown.load(profileId, promptMsg, 'Fullscreen', function (target) {
                _this.requestImage(imageDropdown.indexOf(target));
            });
        });
        this.showControls();
        this.isSingular = false;
    };
    FullSizeImageModal.prototype.openOverrided = function () {
        _super.prototype.open.call(this);
        navBar.hide();
    };
    FullSizeImageModal.prototype.close = function () {
        if (this.isSingular == true)
            ViewUtil.hide(imageDropdown.rootElm);
        this.imageCon.unload();
        imageDropdown.clearHighlight();
        imageDropdown.close();
        _super.prototype.close.call(this);
    };
    FullSizeImageModal.prototype.requestImage = function (targetIndex) {
        var _this = this;
        if (targetIndex >= 0 && targetIndex < this.profileImagesCount) {
            this.index = targetIndex;
            this.updateImageCount();
            this.currentImageId = imageDropdown.imageBox.content[this.index].image.imageId;
            Ajax.getProfileImages(this.profileId, this.index, 1, '', null, function (target) { }, function (imageCards) {
                _this.imageCon.load(imageCards[0].image.imageId, null, 'Toggle controls', function (target) { return _this.toggleControls(); });
            });
            imageDropdown.highlightAtIndex(this.index);
        }
    };
    FullSizeImageModal.prototype.updateImageCount = function () { this.imageCount.innerText = this.index + 1 + " / " + this.profileImagesCount; };
    FullSizeImageModal.prototype.toggleSingularControls = function () {
        ViewUtil.isDisplayed(Modal.btnClose) ? this.hideSingularControls() : this.showSingularControls();
    };
    FullSizeImageModal.prototype.showSingularControls = function () {
        var _this = this;
        ViewUtil.show(Modal.btnClose);
        ViewUtil.show(this.imageDateTime, 'inline', function () { return _this.imageDateTime.style.display = 'inline'; });
        navBar.show();
    };
    FullSizeImageModal.prototype.hideSingularControls = function () {
        ViewUtil.hide(Modal.btnClose);
        ViewUtil.hide(this.imageDateTime);
        navBar.hide();
    };
    FullSizeImageModal.prototype.toggleControls = function () { ViewUtil.isDisplayed(this.btnNext) ? this.hideControls() : this.showControls(); };
    FullSizeImageModal.prototype.showControls = function () {
        ViewUtil.show(imageDropdown.rootElm);
        this.imageControls.forEach(function (control) { return ViewUtil.show(control); });
    };
    FullSizeImageModal.prototype.hideControls = function () {
        navBar.hide();
        ViewUtil.hide(imageDropdown.rootElm);
        this.imageControls.forEach(function (control) { return ViewUtil.hide(control); });
    };
    return FullSizeImageModal;
}(Modal));
//# sourceMappingURL=FullSizeImageModal.js.map