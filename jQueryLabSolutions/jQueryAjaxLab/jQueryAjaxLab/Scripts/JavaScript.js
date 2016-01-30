/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.dataTables.min.js" />
$(document).ready(function () {
    var row = 0;
    $('table td').each(function (i) {
        if (i % 4 == 0) row++;
        $(this).text('Cell: ' + i % 4 + ' Row: ' + row);
    });

    $('table').dataTable();
});
