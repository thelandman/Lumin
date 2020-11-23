﻿/*
    This class controls the content in the friends dropdown.

    Two types of results are displayed:
    (1) A mixture of profiles from friend records with statuses of 'friend' and 'requestedUser' (See Friends in /Documentation/Guide.txt).
    (2) The profiles that related most highly to the search query.
*/
class FriendDropdown extends Dropdown {
    
    // Input elm for user to enter serach terms in.
    // XXX If this dropdown is used to display someone elses friends the search bar will be hidden!!!
    private txtSearch: HTMLInputElement;

    // Button set to invoke a search.
    // XXX If this dropdown is used to display someone elses friends the search btn will be hidden!!!
    private btnSearch: HTMLElement;

    // A container elm enhanced by the ContentBox class used to store profile cards from search results.
    private friendsBox: ContentBox;

    /*
        Gets handles on all necessary components.
        Sets up event listeners.
        Sudo-inherits from sudo-base class.
    */
    public constructor(
        rootElm: HTMLElement,
        contentElm: HTMLElement,
        txtSearch: HTMLInputElement,
        btnSearch: HTMLElement,
        friendBoxElm: HTMLElement
    ) {

        super(rootElm, contentElm);

        // Get handles on dropdown HTML elms.
        this.txtSearch = txtSearch;
        this.btnSearch = btnSearch;

        // Create a new content box using a dropdown HTML component and get a handle on it.
        this.friendsBox = new ContentBox(friendBoxElm);

        // Set up the event listeners for invoking a search either by clicking on btnSearch or pressing the Enter key.
        this.btnSearch.onclick = () => this.requestFriendables()
        this.txtSearch.onkeyup =e=> { if (e.keyCode == 13) this.btnSearch.click(); }
    }
    
    public open(): void {
        this.requestFriends();
        this.txtSearch.value = "";

        super.open()
    }

    /*
        Display accepted friends and pending request to the current user's profile.
    */
    private requestFriends(): void {

        // Clear any previous results from friendsBox.
        this.friendsBox.clear();

        // Request unnaccepted friend requests to the current user's profile (requestedUser) and add to friendsBox.
        Ajax.getFriends(null, null, profiles => this.friendsBox.add(profiles));

        // Request accepted friend requests to and from the current user's profile (friend) and add to friendsBox.
        // XXX may need to use currentUser.id instead of profileId if this dropdown is not used to display other profiles' friends.
        Ajax.getFriends(User.profileId, null, profiles => this.friendsBox.add(profiles));
    }

    /*
        Send a search request to the host with the user input.
    */
    private requestFriendables(): void {

        // Extract user search input and get a handle on it.
        let search = this.txtSearch.value;

        // If nothing was entered,
        if (search == "") {

            // invoke request friends (refresh the list),
            this.requestFriends();
            return;
        }

        // else, clear the list,
        this.friendsBox.clear();

        // and send a search request.
        Ajax.getFriends(null, search,

            // When the results return as profile cards, add them to the friends box.
            profiles => this.friendsBox.add(profiles));
    }
}