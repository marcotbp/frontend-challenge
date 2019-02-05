var Challenge = Challenge || {};

Challenge.SearchUsers = ((utils) => {

    const itemsPerPage = 25;
    const $message = $('.message');
    const $searchResultList = $('.search-result__list tbody');
    const $totalCount = $('#totalCount');
    const $currentPage = $('#page');

    let searchUsers = ($searchInput, params) => {
        clearMessage();

        $searchInput.addClass('search-input--loading');
        $searchResultList.html('');

        $.get(`${utils.properties.apiUrl}/search/users`, params)
            .done((data) => {

                clearMessage();

                if (data.total_count === 0) {
                    $('.search-result__count').hide();
                    $message.addClass('message--info');
                    $message.text('No users found.')

                    return;
                }

                $totalCount.val(data.total_count);                

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

    let createPagination = ($searchInput, params) => {
        setTotals();

        $('.search-result__count .search-result__count--previous').click(() => {
            let currentPage = parseInt($currentPage.val(), 10);

            if (currentPage === 1) {
                $message.addClass('message--info');
                $message.text('Already on first page.')
            } else {
                $('.search-result__count').hide();
                decrementPage();
                params.page = $currentPage.val();
                searchUsers($searchInput, params);
            }
        });

        $('.search-result__count .search-result__count--next').click(() => {

            let currentPage = parseInt($currentPage.val(), 10);
            let total_count = parseInt($totalCount.val(), 10);

            if (parseInt(total_count / itemsPerPage, 10) + 1 === currentPage) {
                $message.addClass('message--info');
                $message.text('Already on last page.')
            } else {
                $('.search-result__count').hide();
                incrementPage();
                params.page = $currentPage.val();
                searchUsers($searchInput, params);
            }
        });
    }

    let setTotals = () => {
        const totalCount = parseInt($totalCount.val(), 10);
        let totalPages = 0;

        if (parseInt(totalCount % itemsPerPage, 10) === 0) {
            totalPages = totalCount / itemsPerPage;
            $('#totalPages').val(totalPages);
        } else {
            totalPages = parseInt(totalCount / itemsPerPage, 10) + 1;
            $('#totalPages').val(totalPages);
        }

        $('.search-result__count').html(`
                Showing ${getNumberOfShowing(totalPages, totalCount)} from ${totalCount} users
                <a class="search-result__count--previous" href="#">Previous</a>
                <a class="search-result__count--next" href="#">Next</a>
            `);
    }

    let getNumberOfShowing = (totalPages, totalCount) => {
        let currentPage = parseInt($currentPage.val(), 10);

        if (totalPages === 1) {
            return totalCount;
        } else if (currentPage === totalPages) {
            return `${(totalCount - totalCount % itemsPerPage)}-${totalCount}`;
        }

        let maxShowing = itemsPerPage * currentPage;

        return `${(maxShowing - (itemsPerPage - 1))}-${maxShowing}`;
    }

    let incrementPage = () => {
        setCurrentPage(parseInt($currentPage.val(), 10) + 1);
    }

    let decrementPage = () => {
        setCurrentPage(parseInt($currentPage.val(), 10) - 1);
    }

    let setCurrentPage = (value) => {
        $currentPage.val(value);
    }

    let clearMessage = () => {
        $message.html('');
        $message.removeClass('message--info');
        $message.removeClass('message--error');
    }

    return {
        setPage: setCurrentPage,
        search: searchUsers,

        properties: {
            perPage: itemsPerPage,
            currentPage: $currentPage.val()
        }
    }
})(Challenge.Utils);

((searchUsers) => {
    $(document).ready(() => {

        const $searchInput = $('.search-users .search-input');

        $searchInput.keyup((e) => {

            if (e.keyCode == 13) {

                searchUsers.setPage(1);

                if ($searchInput.val().length == 0) {
                    return;
                }

                let params = {
                    q: $searchInput.val(),
                    per_page: searchUsers.properties.perPage,
                    page: searchUsers.properties.currentPage
                };

                searchUsers.search($searchInput, params);
            }
        });
    })
})(Challenge.SearchUsers);