var customersPage = function () {   

    var init = function () {
        var vm = new CustomersViewModel();
        vm.getCustomers();
        ko.applyBindings(vm);
    };

    return {
        init: init
    };

}();