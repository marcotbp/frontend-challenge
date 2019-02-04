class User {
    constructor(options) {
        this.avatar_url = options.avatar_url;
        this.bio = options.bio;
        this.email = options.email;
        this.followers = options.followers;
        this.following = options.following;
    }

    toJson() {
        return JSON.stringify(this);
    }
}