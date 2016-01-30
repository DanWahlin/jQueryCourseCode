var orderWizard = function () {

    var currentStep = 0,
    dataView = null,
    init = function () {

        //Wizard functionality
        $('.WizardStep:eq(0)').css('display', 'block');
        $('.WizardStepHeader:eq(0)').addClass('WizardStepHeaderCurrent');
        $('#BackButton').addClass('WizardButtonHidden');
        $('.WizardStepHeader').each(function (index) {
            $(this).bind('click', { value: 0, step: index }, showWizardStep);
        });
        $('#BackButton').bind('click', { value: -1, step: null }, showWizardStep);
        $('#NextButton').bind('click', { value: 1, step: null }, showWizardStep);

        //Dialog functionality
        $('#Dialog').dialog({
            bgiframe: true,
            height: 300,
            width: 450,
            autoOpen: false,
            modal: true,
            resizable: false,
            title: 'Oops - Something\'s Wrong',
            buttons: { "Close": function () { $(this).dialog("close") } }
        });


        //Order items checkbox functionality
        $('#OrderForm :checkbox').each(function () {
            var id = $(this).attr('id').replace(/Order_VendorItemCheckbox_/g, '');
            $(this).click(function () {
                var price = parseFloat($(this).attr('price'));
                var div = $('#vendorItemDiv_' + id);

                if ($(this).prop('checked') == true && div.html() == '') {
                    div.html('<br />How many? <input type="text" price="' + price +
                        '" style="width:25px;" maxlength="3" name="Order.NumberOrdered_' + id + '" id="Order_NumberOrdered_' + id + '" /><br />');


                    //Add numeric mask code here



                    //Handle keyup event so we can update sub total
                    $('#Order_NumberOrdered_' + id).keyup(function (event) {
                        //0 = 48, 9 = 57, Backspace = 8, Delete = 46
                        //On keypad: 0 = 96, 9 = 105
                        if (((event.keyCode > 47 && event.keyCode < 58) || (event.keyCode > 95 && event.keyCode < 106)) ||
                              event.keyCode == 8 || event.keyCode == 46) {
                            updateSubTotal();
                        }
                    });
                }
                if ($(this).prop('checked') == false && div.html() != '') {
                    div.html(null);
                    updateSubTotal();
                }
            });
        });

        $('#PlaceOrderButton').click(function () {

            //Add block UI code here



            var params = $('form').serialize();
            //Simulate the order being placed
            window.setTimeout(function () {
                placeOrderComplete({ "Status": true, "Errors": [] });
            }, 2000);

        });


    };


    function placeOrderComplete(json) {

        //Add unblock UI code here



        if (json.Status) {
            $('#PlaceOrderButton').replaceWith('<span style="font-size:11pt;font-weight:bold;color:Green;">Your order has been placed!</span>');
            $('.WizardStepHeaderContainer, .WizardControls').css('display', 'none');
            $('#ApproveLegend').text('Order Placed');
        }
        else {
            var errors = '';
            for (error in json.Errors) {
                errors += error.ErrorMessage + '<br />';
            }
            openDialog('There was a problem placing your order: <br />Unable to process credit card transaction.');
        }
    }

    function placeOrderError(xhr, desc, exceptionobj) {
        openDialog('Hmmm...something went wrong when we tried to place the order (' + desc + ').  Please click the Contact Us link and provide details about the order so that we can look into it for you.');
    }


    function showWizardStep(event) {
        var val = event.data.value;
        var step = event.data.step; //If there's a value then we want to jump directly to a step

        if (step != null && currentStep == step) return;
        //Validate step before switching to another step
        if (!validateStep(currentStep)) return false;

        var max = $('.WizardStep').length - 1;

        $('.WizardStep:eq(' + currentStep + ')').css('display', 'none');
        $('.WizardStepHeader:eq(' + currentStep + ')').removeClass('WizardStepHeaderCurrent')
            .addClass('WizardStepComplete');

        if (val != 0) {
            currentStep += val;
            if (currentStep < 0) currentStep = 0;
            if (currentStep > max) currentStep = max;
        } else {
            currentStep = step;
        }

        $('.WizardStep:eq(' + currentStep + ')').css('display', 'block');
        $('.WizardStepHeader:eq(' + currentStep + ')').removeClass('WizardStepComplete')
            .addClass('WizardStepHeaderCurrent');

        $('#BackButton').toggleClass('WizardButtonHidden', currentStep == 0);
        $('#NextButton').toggleClass('WizardButtonHidden', currentStep == max);
        if (currentStep == max) loadApprovalDiv();
    }

    function validateStep(step) {
        switch (step) {
            case 0:
                return validateDeliveryInformation();
            case 1:
                return ValidateItems();
            case 2:
                return ValidatePaymentInformation();
            case 3:
                return true;
            case 4: //On approval page so just return true
                return true;
        }
    }

    function validateDeliveryInformation() {
        var error = false;
        $('#DeliveryInformationTable input, #DeliveryInformationTable select').each(function () {
            if ($(this).attr('id') != 'Comments' && $(this).attr('id') != 'Delivery_Suite' && $(this).val() == '') {
                error = true;
                return false; //Exit jQuery each()
            }
        });
        if (error == true) {
            openDialog('All of the delivery information fields are required except for the suite and special instructions box.');
            return false;
        }
        return true;
    }

    function ValidateItems() {
        var subTotal = parseFloat($('#SubTotal').text());
        var minimumOrderAmount = parseFloat($('#MinimumOrderAmount').val());
        if (subTotal < minimumOrderAmount) {
            var errorMsg = 'The current order is less than the vendor\'s minimum order amount of $' + $('#MinimumOrderAmount').val() + '.  Please select additional menu items.';
            openDialog(errorMsg)
            return false;
        }
        return true;
    }

    function ValidatePaymentInformation() {
        var error = false;
        $('#PaymentInformationTable input, #PaymentInformationTable select').each(function () {
            if ($(this).val() == '') {
                error = true;
                return false; //Exit jQuery each()
            }
        });
        if (error == true) {
            openDialog('All of the payment information fields are required.');
            return false;
        }
        return true;
    }

    function loadApprovalDiv() {
        var subTotal = parseFloat($('#SubTotal').text());
        $('#ClientSubTotal').val(subTotal.toFixed(2));
        var salesTaxRate = parseFloat($('#SalesTaxRate').val()) / 100;
        var salesTaxAmount = (subTotal * salesTaxRate) * .9;
        var deliveryFee = parseFloat($('#DeliveryFee').val());
        var adminFee = ((subTotal + salesTaxAmount + deliveryFee) * .05);
        var total = (round(subTotal) + round(salesTaxAmount) + round(deliveryFee) +
                     round(adminFee));
        $('#ClientTotal').val(total);
        var deliveryAddress = $('#Delivery_Street').val();
        //See if they entered a suite
        if ($('#Delivery_Suite').val() != '') deliveryAddress += ', Suite ' + $('#Delivery_Suite').val();
        deliveryAddress += ' ' + $('#Delivery_City').val() + ' ' + $('#Delivery_StateID option:selected').text() + ' ' +
                           $('#Delivery_Zip').val();
        var creditCard = $('#Payment_CreditCardNumber').val();
        var abbrCreditCard = '*' + creditCard.substring(creditCard.length - 5);

        var data = {
            'FinalSubTotal': subTotal.toFixed(2),
            'FinalSalesTax': salesTaxAmount.toFixed(2),
            'FinalTotal': total.toFixed(2),
            'DeliveryFee': deliveryFee.toFixed(2),
            'AdminFee': adminFee.toFixed(2),
            'DeliveryName': $('#Delivery_Name').val(),
            'DeliveryAddress': deliveryAddress,
            'CreditCard': abbrCreditCard,
            'DeliveryDate': $('#Delivery_DeliveryDate').val(),
            'DeliveryTime': $('#Delivery_DeliveryTime option:selected').text(),
            'MainItems': generateJson('Main'),
            'AccessoryItems': generateJson('Accessory')
        };

        //Handlebars template
        var html = $('#OrderSummaryTemplate').html();
        var template = Handlebars.compile(html);
        $('#OrderSummaryOutput').html(template(data));
    }

    function round(num) {
        var result1 = num.toFixed(2);
        return parseFloat(result1);
    }


    function generateJson(category) {
        var jsonArray = [];
        $('#OrderTable input[category="' + category + '"]:checked').each(function () {
            //Get numeric part of checkbox ID
            var id = $(this).attr('id').replace(/Order_VendorItemCheckbox_/g, '');
            //Find associated textbox to grab number of people
            var numberOfPeople = $('#Order_NumberOrdered_' + id).val();
            jsonArray.push('{ "Name":"' + $(this).attr('itemName') +
                              '","Price":"' + $(this).attr('price') +
                              '","NumberOrdered":"' + numberOfPeople + '"}');

        });
        return eval('([' + jsonArray.join(',') + '])');

    }

    function updateSubTotal() {
        var subTotal = 0;
        var subTotalSpan = $('#SubTotal');
        //Iterate through each number of people textbox and calculate new subtotal
        $('#OrderForm input[id^=Order_NumberOrdered_]').each(function () {
            var amount = parseFloat($(this).attr('price')).toFixed(2);
            var numPeople = parseInt($(this).val());
            if (!isNaN(amount) && !isNaN(numPeople)) {
                subTotal += amount * numPeople;
            }
        });
        if (subTotal == 0) {
            subTotalSpan.text('0.00')
        }
        else {
            subTotalSpan.text(subTotal.toFixed(2))
        }

    }

    function openDialog(msg) {
        $('#DialogErrors').html(msg);
        $('#Dialog').dialog('open');
    }

    return {
        init: init
    }

}();

orderWizard.init();

