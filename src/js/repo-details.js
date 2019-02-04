$(document).ready(() => {

    const $message = $('.message');
    const $repoDetails = $('.repo-details__list .repo-details__list-item');

    let repositoryParam = decodeURI(getUrlVars().repository);

    if (!repositoryParam) {
        $message.text('Repository parameter not informed.')
    }

    $.get(`${api_url}/repos/${repositoryParam}`)
        .done((data) => {
            $repoDetails.find('.repo-details__list-item--name-value').append(data.name);
            $repoDetails.find('.repo-details__list-item--description-value').append(data.description ? data.description : '');
            $repoDetails.find('.repo-details__list-item--stars-value').append(data.stargazers_count);
            $repoDetails.find('.repo-details__list-item--language-value').append(data.language);
            $repoDetails.find('.repo-details__list-item--link-value').append(`<a class="github-icon" href="${data.html_url}"></a>`);
        })
        .fail(() => {
            $message.text('Repository not found.')
        });
})