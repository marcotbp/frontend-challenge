var Challenge = Challenge || {};

Challenge.User = class User {
    constructor(options) {
        this.avatar_url = options.avatar_url;
        this.bio = options.bio ? options.bio : 'No bio defined.';
        this.email = options.email ? options.email : 'No email defined.';
        this.followers = options.followers;
        this.following = options.following;
        this.login = options.login;
        this.repos = options.repos;
    }

    toJson() {
        return JSON.stringify(this);
    }
}