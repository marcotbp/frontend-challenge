const api_url = 'https://api.github.com';

function getUrlVars() {
    let vars = [];
    let hash = [];
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

class User {
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