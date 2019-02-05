var Challenge = Challenge || {};

Challenge.Utils = (() => {
    const gitHubApiUrl = 'https://api.github.com';

    let getUrlVars = () => {
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

    return {
        properties: {
            apiUrl: gitHubApiUrl
        },

        getQueryString: getUrlVars
    }
})();