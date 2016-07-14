/// <reference path="jquery-2.2.0.intellisense.js" />

$(document).ready(function() {
    $('#SubmitButton').click(update);
    getProducts();
    getCategories();
});

function getProducts() {
    $.getJSON(serviceUrl + 'products', function (prods) {
        var div = $('#ProductsDiv');
        div.html('');
        $('#ProductID').html('');
        $('#ModelName').val('');
        $('#Categories').val('');
        for (var i = 0; i < prods.length; i++) {
            var prodDiv = $(document.createElement('div'));
            prodDiv.data("data", prods[i]); //Store product object in DOM        
            prodDiv.addClass('ProductDivContainer');
            prodDiv.append('<div class="ImageDiv"><img src="' +
                        images + prods[i].ProductImage + '" /></div>');
            prodDiv.append('<div class="ProductDiv">' +
                        prods[i].ModelName + '</div>');
            prodDiv.click(showProduct);
            div.append(prodDiv);
        }
        $('.ProductDiv').hover(function () {
            $(this).toggleClass('Over');
        });
    });
}

function getCategories() {
    $.getJSON(serviceUrl + 'categories', function (cats) {
        var options = '';
        for (var i = 0; i < cats.length; i++) {
            options += '<option value="' + cats[i].CategoryID + '">' +
                    cats[i].CategoryName + '</option>';
        }
        $("#Categories").html(options);
    });
}

function update() {
    if (currProd == null) return false;
    currProd.ModelName = $('#ModelName').val();
    currProd.CategoryID = $('#Categories').val();

    $.ajax({
        url: serviceUrl + 'product',
        type: 'PUT',
        data: JSON.stringify(currProd),
        dataType: 'json',
        contentType: 'application/json'
    })
    .done(function (data) {
        if (data.Status) {
          currProd = null;
          getProducts();
        }
        else {
          alert("Update failed.");
        }
    });

    return false;
}

function showProduct() {
    currProd = $(this).data('data');
    $('#ProductID').html(currProd.ProductID);
    $('#ModelName').val(currProd.ModelName);
    $('#Categories').val(currProd.CategoryID);

}

var serviceUrl = 'api/dataservice/',
    images = 'ProductImages/thumbs/',
    currProd;