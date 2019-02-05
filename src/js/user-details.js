var Challenge = Challenge || {};

Challenge.UsersDetails = ((utils, User) => {

    const $message = $('.message');
    const $userReposList = $('.user-repos__list tbody');

    let getUserDetails = () => {
        let userParam = utils.getQueryString().user;

        if (!userParam) {
            $message.text('User parameter not informed.')
        }

        $.get(`${utils.properties.apiUrl}/users/${userParam}`)
            .done((data) => {

                let user = new User({
                    repos: [],
                    login: data.login,
                    following: data.following,
                    followers: data.followers,
                    email: data.email,
                    bio: data.bio,
                    avatar_url: data.avatar_url
                });

                sessionStorage.setItem('user-details', user.toJson());

                createUserDetails(user);
            })
            .fail((error) => {
                $message.addClass('message--error');
                $message.text(error.responseJSON.message)
            });

        $('.user-repos .user-repos__list .user-repos__list--sort').click((e) => {
            e.preventDefault();
            sortRepos();
        })
    }

    let getUserRepos = (user) => {

        $.get(`${utils.properties.apiUrl}/users/${user}/repos`)
            .done((data) => {

                data.sort((a, b) => sortByStars(a, b, $userReposList.data('sort') === 'desc'));
                toggleSortDirection();

                user = getUserFromStorage();

                if (user === null) {
                    $message.text('User not found on storage.');

                    return;
                }

                user.repos = data;
                sessionStorage.setItem('user-details', user.toJson());

                $('.user-repos__count').text(`${data.length} repositories`)

                createReposTable(data);
            })
            .fail((error) => {
                $message.addClass('message--error');
                $message.text(error.responseJSON.message)
            });
    }

    let sortByStars = (a, b, desc) => {
        if (desc) {
            return b.stargazers_count - a.stargazers_count;
        }

        return a.stargazers_count - b.stargazers_count;
    }

    let getUserFromStorage = () => {
        if (sessionStorage.getItem('user-details')) {
            return Object.assign(new User(JSON.parse(sessionStorage.getItem('user-details'))));
        }

        return null;
    }

    let createUserDetails = (user) => {

        $('.user-title').append(`<h1>${'User: '.bold()}${user.login}</h1>`);
        $('.user-details').html('');
        $('.user-details').append(
            `   <div class="user-details__container">
                    <div class="user-details__item user-details__avatar">
                        <img src="${user.avatar_url}" width="230px" height="230px">
                    </div>
                    <div class="user-details__item user-details__info">                
                        <p>${'Followers: '.bold()}${user.followers}</p>
                        <p>${'Following: '.bold()}${user.following}</p>
                        <p>${'Email: '.bold()}${user.email}</p>
                        <p>${'Bio: '.bold()}${user.bio}</p>
                    </div>
                </div>
            `
        );

        getUserRepos(user.login);
    }

    let createReposTable = (data) => {
        $userReposList.html('');

        for (let repo of data) {
            $userReposList.append(
                `<tr data-repository="${repo.full_name}" class="user-repos__list-item">
                    <td>${repo.name}</td>                
                    <td>${repo.stargazers_count}</td>                
                    <td><a class="github-icon" href=${repo.html_url}></a></td>                        
                </tr>`
            );
        }

        $userReposList.find('.user-repos__list-item').each((index, item) => {
            $(item).click(() => {
                window.location.href = `repo-details.html?repository=${encodeURI($(item).data('repository'))}`;
            })
        })
    }

    let sortRepos = () => {
        let user = getUserFromStorage();

        if (user === null) {
            $message.text('User not found on storage.');

            return;
        }

        user.repos.sort((a, b) => sortByStars(a, b, $userReposList.data('sort') === 'desc'));
        toggleSortDirection();

        createReposTable(user.repos);
    }

    let toggleSortDirection = () => {
        if ($userReposList.data('sort') === 'desc') {
            $userReposList.data('sort', 'asc')
        } else {
            $userReposList.data('sort', 'desc')
        }
    }

    return {
        getUserDetail: getUserDetails
    }

})(Challenge.Utils, Challenge.User);

((userDetails) => {
    $(document).ready(() => {
        userDetails.getUserDetail();
    })
})(Challenge.UsersDetails);