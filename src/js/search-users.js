$(document).ready(() => {

    const $searchInput = $('.search-users .search-input');

    $searchInput.keyup((e) => {

        if (e.keyCode == 13) {

            $('#page').val('1');

            if ($searchInput.val().length == 0) {
                return;
            }

            let params = {
                q: $searchInput.val(),
                per_page: 25,
                page: getPage()
            };

            searchUsers($searchInput, params);
        }
    });
})

function searchUsers($searchInput, params) {

    const $message = $('.message');
    const $searchResultList = $('.search-result__list tbody');

    clearMessage();

    $searchInput.addClass('search-input--loading');
    $searchResultList.html('');

    $.get(`${api_url}/search/users`, params)
        .done((data) => {

            $('#totalCount').val(data.total_count);

            for (let user of data.items) {
                $searchResultList.append(
                    `<tr data-login="${user.login}" class="search-result__list-item">
                        <td><img src="${user.avatar_url}" width="48px" height="48px"></a></td>
                        <td>${user.login}</td>
                    </tr>`
                );
            }

            $searchResultList.find('.search-result__list-item').each((index, item) => {
                $(item).click(() => {
                    window.location.href = `user-details.html?user=${encodeURI($(item).data('login'))}`;
                })
            });

            createPagination($searchInput, params);
            $('.search-result__count').show();
        })
        .fail((error) => {
            $message.addClass('message--error');
            $message.text(error.responseJSON.message)
        })
        .always(() => {
            $searchInput.removeClass('search-input--loading');            
        });
}

function createPagination($searchInput, params) {

    const $message = $('.message');
    const totalCount = $('#totalCount').val();

    setTotals();

    $('.search-result__count .search-result__count--previous').click(() => {
        let currentPage = parseInt(getPage(), 10);

        if (currentPage === 1) {
            $message.addClass('message--info');
            $message.text('Already on first page.')
        } else {
            $('.search-result__count').hide();
            decrementPage();
            params.page = getPage();
            searchUsers($searchInput, params);
        }
    });

    $('.search-result__count .search-result__count--next').click(() => {

        let currentPage = parseInt(getPage(), 10);
        let total_count = parseInt(totalCount, 10);

        if (parseInt(total_count / 25, 10) + 1 === currentPage) {
            $message.addClass('message--info');
            $message.text('Already on last page.')
        } else {
            $('.search-result__count').hide();
            incrementPage();
            params.page = getPage();
            searchUsers($searchInput, params);
        }
    });
}

function setTotals() {
    const totalCount = $('#totalCount').val();

    let totalCountInt = parseInt(totalCount, 10);
    let totalPages = 0;

    if (parseInt(totalCountInt % 25, 10) === 0) {
        totalPages = totalCountInt / 25;
        $('#totalPages').val(totalPages);
    } else {
        totalPages = parseInt(totalCountInt / 25, 10) + 1;
        $('#totalPages').val(totalPages);
    }

    $('.search-result__count').html(`
            Showing ${getNumberOfShowing(totalPages, totalCountInt)} from ${totalCount} users
            <a class="search-result__count--previous" href="#">Previous</a>
            <a class="search-result__count--next" href="#">Next</a>
        `);
}

function getNumberOfShowing(totalPages, totalCount) {
    let currentPage = parseInt(getPage(), 10);

    if (totalPages === 1) {
        return totalCount;
    } else if (currentPage === totalPages) {
        return `${(totalCount - totalCount % 25)}-${totalCount}`;
    }

    let maxShowing = 25 * currentPage;

    return `${(maxShowing - 24)}-${maxShowing}`;
}

function incrementPage() {
    $('#page').val(parseInt($('#page').val(), 10) + 1);
}

function decrementPage() {
    $('#page').val(parseInt($('#page').val(), 10) - 1);
}

function getPage() {
    return $('#page').val();
}

function clearMessage() {
    const $message = $('.message');

    $message.html('');
    $message.removeClass('message--info');
    $message.removeClass('message--error');
}