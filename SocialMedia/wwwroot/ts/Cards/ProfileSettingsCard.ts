﻿class ProfileSettingsCard extends Card {

    public btnToggleSettingsSection: ToggleButton;

    constructor(
        rootElm: HTMLElement,
        btnToggleSettingsSection: HTMLElement,
        private selectProfilePictureSetting: HTMLElement,
        private selectBioSetting: HTMLElement,
        private selectImagesSetting: HTMLElement,
        private selectFriendsSetting: HTMLElement,
        private selectPostsSetting: HTMLElement,
        private txtProfileColor: HTMLInputElement
    ) {
        super(rootElm);

        this.btnToggleSettingsSection = new ToggleButton(null, btnToggleSettingsSection, null, [
            new ToggleState('fa-cog', 'Open profile settings', () => ViewUtil.show(this.rootElm, 'block')),
            new ToggleState('fa-times', 'Close profile settings', () => ViewUtil.hide(this.rootElm))
        ]);
    }
}